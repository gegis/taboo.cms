const { Service, Model, cmsHelper } = require('@taboo/cms-core');

class PagesController {
  // Dynamic Pages action
  async page(ctx, next) {
    const { request } = ctx;
    const { path: requestPath } = request;
    let route = requestPath;
    let layout, pageTpl, pageVariables, galleryTpl;
    if (route && route.length > 1 && route.slice(-1) === '/') {
      route = route.slice(0, -1);
    }
    const page = await Model('pages.Page')
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
      if (page.layout === 'no-layout') {
        layout = '<%-_body%>';
      } else {
        layout = await cmsHelper.getLayout(page.layout);
      }
      pageTpl = await cmsHelper.getView(ctx.taboo.moduleRoute);
      // TODO allow page select gallery template.
      galleryTpl = await cmsHelper.getTemplate('helpers/gallery');
      // TODO - cache this bit as it is recursive and it might become performance issue.
      await Service('pages.Pages').replacePageBodyRefs(ctx, page, galleryTpl);
      pageVariables = page.variables || {};
      pageVariables.pageTitle = page.title;
      pageVariables.pageBody = page.body;
      if (page.language) {
        Service('core.LanguageService').setLanguage(ctx, page.language);
      }
      ctx.body = cmsHelper.composeResponse(ctx, layout, pageTpl, pageVariables);
    } else {
      ctx.throw(404);
    }
    await next();
  }

  async getPageJson(ctx) {
    const {
      request: { query = {} },
    } = ctx;
    const page = await Model('pages.Page')
      .findOne({ $or: [{ url: query.url }, { url: `${query.url}/` }], published: true })
      .populate([
        'pages',
        {
          path: 'galleries',
          populate: {
            path: 'images',
          },
        },
      ]);
    let galleryTpl;
    if (page) {
      galleryTpl = await cmsHelper.getTemplate('helpers/gallery');
      await Service('pages.Pages').replacePageBodyRefs(ctx, page, galleryTpl);
      ctx.body = page;
    } else {
      ctx.throw(404, 'Not Found');
    }
  }
}

module.exports = new PagesController();
