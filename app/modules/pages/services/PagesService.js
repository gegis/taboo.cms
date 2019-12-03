const { Helper, Model, Service, cmsHelper, config } = require('@taboo/cms-core');

class PagesService {
  async getPageResponse(ctx, route) {
    const { client: { metaTitle } = {} } = config;
    let layout, pageTpl, pageVariables, pageResponse;
    const page = await this.getPage(ctx, route);

    if (page) {
      if (page.layout === 'no-layout') {
        layout = '<%-_body%>';
      } else {
        layout = await cmsHelper.getLayout(page.layout);
      }
      pageTpl = await cmsHelper.getView(ctx.taboo.moduleRoute);
      pageVariables = page.variables || {};
      pageVariables = Object.assign({}, ctx.view, pageVariables);
      pageVariables.metaTitle = `${page.title} | ${metaTitle}`;
      pageVariables.pageTitle = page.title;
      pageVariables.pageBody = page.body;
      if (page.language) {
        Service('core.LanguageService').setLanguage(ctx, page.language);
      }
      pageResponse = cmsHelper.composeResponse(ctx, layout, pageTpl, pageVariables);
    }

    return pageResponse;
  }

  async getPage(ctx, route) {
    let galleryTpl;
    // Try to get from cache
    let page = Service('cache.Cache').get('pages', `page:${route}`);
    if (!page) {
      // Not in cache - try to retrieve, parse and cache it
      page = await Model('pages.Page')
        .findOne({ $or: [{ url: route }, { url: `${route}/` }], published: true })
        .populate([
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
        galleryTpl = await cmsHelper.getTemplate('helpers/gallery');
        await Service('pages.Pages').replacePageBodyRefs(ctx, page, galleryTpl);
        Service('cache.Cache').set('pages', `page:${route}`, page);
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
        page.body = this.replacePageBodyGalleries(ctx, page.body, page.galleries, galleryTpl);
      }
      if (childPages) {
        page.body = this.replacePageBodyPages(page.body, childPages);
      }
      if (childGalleries) {
        page.body = this.replacePageBodyGalleries(ctx, page.body, childGalleries, galleryTpl);
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
    return await Model('pages.Page')
      .find({ _id: { $in: ids } })
      .populate([
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
    return await Model('galleries.Gallery')
      .find({ _id: { $in: ids } })
      .populate('images');
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

  replacePageBodyGalleries(ctx, body, galleries, galleryTpl) {
    let newBody = body;
    galleries.map(item => {
      newBody = newBody.replace(
        `{{Gallery:${item._id}}}`,
        Helper('galleries.Gallery').getTemplate(ctx, item, galleryTpl)
      );
    });

    return newBody;
  }

  deletePageCacheByUrl(url) {
    Service('cache.Cache').delete('pages', `page:${url}`);
    if (url && url.length > 1 && url.slice(-1) === '/') {
      Service('cache.Cache').delete('pages', `page:${url.slice(0, -1)}`);
    }
  }

  deleteAllPagesCache() {
    Service('cache.Cache').clearCacheId('pages');
  }
}

module.exports = new PagesService();
