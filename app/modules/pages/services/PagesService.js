const { Helper, Model } = require('@taboo/cms-core');

class PagesService {
  populatePagesAndGalleries(data) {
    if (data && data.body && data.body.indexOf('{{') !== -1 && data.body.indexOf('}}') !== -1) {
      let items = data.body.split(/[{{}}]+/);
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
  async replacePageBodyRefs(ctx, page, galleryTpl, childPages = [], childGalleries = []) {
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
          pages = await Model('pages.Page').find({ _id: { $in: data.pages } });
        }
        if (data.galleries && data.galleries.length > 0) {
          galleries = await Model('galleries.Gallery').find({ _id: { $in: data.galleries } });
        }
        if (pages.length > 0 || pages.galleries > 0) {
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
}

module.exports = new PagesService();
