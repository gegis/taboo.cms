const { cmsHelper, config } = require('@taboo/cms-core');
const LanguageService = require('modules/core/services/LanguageService');
const CacheService = require('modules/cache/services/CacheService');
const GalleryHelper = require('modules/galleries/helpers/GalleryHelper');
const PageModel = require('modules/pages/models/PageModel');
const GalleryModel = require('modules/galleries/models/GalleryModel');

class PagesService {
  async getPageResponse(ctx, route) {
    const { client: { metaTitle } = {} } = config;
    let template, pageTpl, pageVariables, pageResponse;
    const page = await this.getPage(ctx, route);

    if (page) {
      if (!page.template || page.template === 'empty') {
        template = '<%-_body%>';
      } else {
        template = await cmsHelper.getLayout(page.template); // TODO (templates) think of redo core and classic layouts/templates
      }
      pageTpl = await cmsHelper.getView(ctx.routeParams.moduleRoute);
      pageVariables = page.variables || {};
      pageVariables = Object.assign({}, ctx.viewParams, pageVariables);
      pageVariables.metaTitle = `${page.title} | ${metaTitle}`;
      pageVariables.pageTitle = page.title;
      pageVariables.pageBody = page.body;
      if (page.language) {
        LanguageService.setLanguage(ctx, 'client', { language: page.language });
      }
      pageResponse = cmsHelper.composeResponse(ctx, template, pageTpl, pageVariables);
    }

    return pageResponse;
  }

  async getPage(ctx, route) {
    const { session: { user: { admin = false } = {} } = {} } = ctx;
    let galleryTpl;
    let page;
    let filter = { $or: [{ url: route }, { url: `${route}/` }] };
    if (!admin) {
      filter.published = true;
      // If not admin - try to get from cache
      page = CacheService.get('pages', `page:${route}`);
    }
    if (!page) {
      // Not in cache - try to retrieve, parse and cache it
      page = await PageModel.findOne(filter).populate([
        'pages',
        {
          path: 'galleries',
          populate: {
            path: 'images',
          },
        },
      ]);
      if (page) {
        // TODO allow page select gallery template.
        galleryTpl = await cmsHelper.getTemplate('gallery/standard');
        await this.replacePageBodyRefs(ctx, page, galleryTpl);
        // Cache only published pages
        if (page.published) {
          CacheService.set('pages', `page:${route}`, page);
        }
      }
    }
    return page;
  }

  populatePagesAndGalleries(data) {
    if (data && data.body && data.body.indexOf('{{') !== -1 && data.body.indexOf('}}') !== -1) {
      let items = data.body.split(/[{{*}}]+/);
      data.pages = [];
      data.galleries = [];
      items.map(item => {
        if (item && item.indexOf('Page:') === 0) {
          data.pages.push(item.replace('Page:', ''));
        } else if (item && item.indexOf('Gallery:') === 0) {
          data.galleries.push(item.replace('Gallery:', ''));
        }
      });
    }
    return data;
  }

  /**
   * It recursively goes through all pages and galleries children until all are replaced
   * @param ctx
   * @param page
   * @param galleryTpl
   * @param childPages
   * @param childGalleries
   * @returns {Promise<*>}
   */
  async replacePageBodyRefs(ctx, page, galleryTpl, childPages = null, childGalleries = null) {
    let data, pages, galleries;
    if (page) {
      if (page.pages) {
        page.body = this.replacePageBodyPages(page.body, page.pages);
      }
      if (page.galleries) {
        page.body = await this.replacePageBodyGalleries(ctx, page.body, page.galleries, galleryTpl);
      }
      if (childPages) {
        page.body = this.replacePageBodyPages(page.body, childPages);
      }
      if (childGalleries) {
        page.body = await this.replacePageBodyGalleries(ctx, page.body, childGalleries, galleryTpl);
      }
      if (page.body && page.body.indexOf('{{') !== -1 && page.body.indexOf('}}') !== -1) {
        data = {
          body: page.body,
        };
        this.populatePagesAndGalleries(data);
        if (data.pages && data.pages.length > 0) {
          pages = await this.getPagesByIds(data.pages);
        }
        if (data.galleries && data.galleries.length > 0) {
          galleries = await this.getGalleriesByIds(data.galleries);
        }
        if ((pages && pages.length > 0) || (galleries && galleries.length > 0)) {
          await this.replacePageBodyRefs(ctx, page, galleryTpl, pages, galleries);
        } else {
          // If just in case pages are now missing, i.e. deleted, replace all with empty strings;
          page.body = page.body.replace(/{{Page:.+}}/, '');
          // If just in case galleries are now missing, i.e. deleted, replace all with empty strings;
          page.body = page.body.replace(/{{Gallery:.+}}/, '');
          return page;
        }
      } else {
        return page;
      }
    } else {
      return page;
    }
  }

  async getPagesByIds(ids) {
    return await PageModel.find({ _id: { $in: ids } }).populate([
      'pages',
      {
        path: 'galleries',
        populate: {
          path: 'images',
        },
      },
    ]);
  }

  async getGalleriesByIds(ids) {
    return await GalleryModel.find({ _id: { $in: ids } }).populate('images');
  }

  replacePageBodyPages(body, pages) {
    let newBody = body;
    let replaceWith;
    pages.map(item => {
      if (item.published) {
        replaceWith = item.body;
      } else {
        replaceWith = '';
      }
      newBody = newBody.replace(`{{Page:${item._id}}}`, replaceWith);
    });
    return newBody;
  }

  async replacePageBodyGalleries(ctx, body, galleries, galleryTpl) {
    let newBody = body;
    for (let i = 0; i < galleries.length; i++) {
      const galleryTemplate = await GalleryHelper.getTemplate(ctx, galleries[i], galleryTpl);
      newBody = newBody.replace(`{{Gallery:${galleries[i]._id}}}`, galleryTemplate);
    }

    return newBody;
  }

  deletePageCacheByUrl(url) {
    CacheService.delete('pages', `page:${url}`);
    if (url && url.length > 1 && url.slice(-1) === '/') {
      CacheService.delete('pages', `page:${url.slice(0, -1)}`);
    }
  }

  deleteAllPagesCache() {
    CacheService.clearCacheId('pages');
  }
}

module.exports = new PagesService();
