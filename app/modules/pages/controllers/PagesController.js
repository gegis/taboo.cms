const { Service } = require('@taboo/cms-core');

class PagesController {
  async page(ctx) {
    const { request } = ctx;
    const { path: requestPath } = request;
    let route = requestPath;
    let pageResponse;
    if (route && route.length > 1 && route.slice(-1) === '/') {
      route = route.slice(0, -1);
    }
    pageResponse = await Service('pages.Pages').getPageResponse(ctx, route);
    if (pageResponse) {
      ctx.body = pageResponse;
    } else {
      return ctx.throw(404);
    }

    // TODO - Not sure why it was here before - needs double checking
    // await next();
  }

  async getPageJson(ctx) {
    const { request: { query: { url } = {} } = {} } = ctx;
    let route = url;
    let page;
    if (route && route.length > 1 && route.slice(-1) === '/') {
      route = route.slice(0, -1);
    }
    page = await Service('pages.Pages').getPage(ctx, route);
    if (page) {
      ctx.body = page;
    } else {
      return ctx.throw(404, 'Not Found');
    }
  }
}

module.exports = new PagesController();
