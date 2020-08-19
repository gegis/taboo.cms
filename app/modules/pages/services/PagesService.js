const { cmsHelper, config } = require('@taboo/cms-core');
const LanguageService = require('modules/core/services/LanguageService');
const CacheService = require('modules/cache/services/CacheService');
const PageModel = require('modules/pages/models/PageModel');

class PagesService {
  async getPageResponse(ctx, route) {
    const { client: { metaTitle: defaultMetaTitle } = {} } = config;
    const { viewParams: { metaTitle = defaultMetaTitle } = {} } = ctx;
    let template, pageTpl, pageVariables, pageResponse;
    const page = await this.getPage(ctx, route);

    if (page) {
      if (!page.template || page.template === 'empty') {
        template = '<%-_body%>';
      } else {
        template = await cmsHelper.getLayout(page.template);
        ctx.viewParams._template = page.template;
      }
      pageTpl = await cmsHelper.getView(ctx.routeParams.moduleRoute);
      pageVariables = {};
      pageVariables = Object.assign({}, ctx.viewParams);
      pageVariables.metaTitle = `${page.title} | ${metaTitle}`;
      pageVariables.pageTitle = page.title;
      pageVariables.metaDescription = page.subtitle;
      pageVariables.fullWidth = page.fullWidth;
      pageVariables.blocks = page.blocks;
      if (page.language) {
        LanguageService.setLanguage(ctx, 'client', { language: page.language });
      }
      pageResponse = cmsHelper.composeResponse(ctx, template, pageTpl, pageVariables);
    }

    return pageResponse;
  }

  async getPage(ctx, route) {
    const { session: { user: { admin = false } = {} } = {} } = ctx;
    let block;
    let beforeRenderModule;
    let page;
    let filter = { $or: [{ url: route }, { url: `${route}/` }] };
    if (!admin) {
      filter.published = true;
      // If not admin - try to get from cache
      page = CacheService.get('pages', `page:${route}`);
    }
    if (!page) {
      // Not in cache - try to retrieve, parse and cache it
      page = await PageModel.findOne(filter);
      if (page) {
        if (page.blocks) {
          for (let i = 0; i < page.blocks.length; i++) {
            block = page.blocks[i];
            if (block.template && block.template.beforeRenderService && block.template.beforeRenderMethod) {
              beforeRenderModule = require(block.template.beforeRenderService);
              block.props = await beforeRenderModule[block.template.beforeRenderMethod](ctx, block.props);
            }
          }
        }
        // Cache only published pages
        if (page.published) {
          CacheService.set('pages', `page:${route}`, page);
        }
      }
    }
    return page;
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
