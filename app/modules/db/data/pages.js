module.exports = [
  {
    _id: '5dd571630203d247ef37c257',
    title: 'Welcome to Taboo CMS',
    url: '/',
    template: 'standard',
    published: true,
    language: 'en',
    blocks: [
      {
        _id: '5ec0493a436f1f2188de9d89',
        name: 'HTML',
        props: {
          html: `<section>
    <div class="rs-panel rs-panel-default rs-panel-bordered">
      <div class="rs-panel-body">
        <h2>Taboo CMS</h2>
        <p>A node.js powered Content Management System with the built-in administration panel.</p>
        <p>
          It can be installed as SPA (Single Page Application), or as server side rendered templates (EJS)
          applications, or simply as Headless CMS for your REST APIs.
        </p>
        <p>
          Taboo CMS was built keeping modular architecture in mind, which means you can easily add or remove self
          sustained modules.
        </p>
        <p>
          <a href="/admin/login">Visit Admin Panel</a>
        </p>
      </div>
    </div>
    <div class="v-spacer-3"></div>
    <div class="rs-panel rs-panel-default rs-panel-bordered">
      <div class="rs-panel-body">
         <h3>Create New Module</h3>
         <p>From your application root folder run this command:</p>
         <p><code>npx taboo-cms-cli module create</code></p>
         <p>It will prompt for module name and model name (model name in singular without 'Model' word in it).</p>
         <p>
           You can find newly installed module in <code>./app/modules/yourModuleName</code>. 
           It creates new module with ACL resources for admin access, so make sure to enable those 
           resources for required Roles in the Admin panel.
         </p>
       </div>
     </div>
</section>`,
        },
        template: { path: '/modules/pages/views/htmlPageBlock' },
      },
    ],
  },
  {
    _id: '5dd59786cc85912a1bc3863f',
    title: 'About',
    url: '/about',
    template: 'standard',
    published: true,
    language: 'en',
    blocks: [
      {
        _id: '5ec042491d39df14f9778563',
        name: 'HTML',
        props: {
          html: `<section>
    <div class="rs-panel rs-panel-default rs-panel-bordered">
        <div class="rs-panel-body">
            <h2>Header 2</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>
    <div class="v-spacer-3"></div>
    <div class="rs-panel rs-panel-default rs-panel-bordered">
        <div class="rs-panel-body">
            <h3>Header 3</h3>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                <ul>
                  <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco</li>
                  <li>Duis aute irure dolor in reprehenderit in voluptate</li>
                  <li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit</li>
                  <li>Minim veniam, quis nostrud exercitation ullamco</li>
                </ul>
            </p>
        </div>
    </div>
</section>`,
        },
        template: { path: '/modules/pages/views/htmlPageBlock' },
      },
    ],
  },
  {
    _id: '5dd575666a19cc6918296c6c',
    published: true,
    title: 'Contact Us',
    url: '/contact',
    language: 'en',
    blocks: [
      {
        _id: '5f3e643393c42f7f3a0535b7',
        name: 'Form',
        props: { formId: '5f3e63f993c42f7f3a0535b4' },
        template: {
          path: '/modules/forms/views/formPageBlock',
          beforeRenderService: 'modules/forms/services/FormsService',
          beforeRenderMethod: 'beforeFormRender',
        },
      },
    ],
    meta: {},
    template: 'standard',
    background: '',
    headerBackground: '',
  },
  {
    _id: '5f3e605531c69e7bc25823ae',
    title: 'Terms & Conditions',
    url: '/terms-and-conditions',
    template: 'standard',
    published: true,
    language: 'en',
    blocks: [
      {
        _id: '5ec042491d39df14f9778563',
        name: 'HTML',
        props: {
          html: `<section>
    <div class="rs-panel rs-panel-default rs-panel-bordered">
        <div class="rs-panel-body">
            <h2>Header 2</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>
    <div class="v-spacer-3"></div>
    <div class="rs-panel rs-panel-default rs-panel-bordered">
        <div class="rs-panel-body">
            <h3>Header 3</h3>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                <ul>
                  <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco</li>
                  <li>Duis aute irure dolor in reprehenderit in voluptate</li>
                  <li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit</li>
                  <li>Minim veniam, quis nostrud exercitation ullamco</li>
                </ul>
            </p>
        </div>
    </div>
</section>`,
        },
        template: { path: '/modules/pages/views/htmlPageBlock' },
      },
    ],
  },
  {
    _id: '5dd68b358777b748a9d95415',
    title: 'Privacy Policy',
    url: '/privacy-policy',
    template: 'standard',
    published: true,
    language: 'en',
    blocks: [
      {
        _id: '5ec042491d39df14f9778563',
        name: 'HTML',
        props: {
          html: `<section>
    <div class="rs-panel rs-panel-default rs-panel-bordered">
        <div class="rs-panel-body">
            <h2>Header 2</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </div>
    <div class="v-spacer-3"></div>
    <div class="rs-panel rs-panel-default rs-panel-bordered">
        <div class="rs-panel-body">
            <h3>Header 3</h3>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                <ul>
                  <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco</li>
                  <li>Duis aute irure dolor in reprehenderit in voluptate</li>
                  <li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit</li>
                  <li>Minim veniam, quis nostrud exercitation ullamco</li>
                </ul>
            </p>
        </div>
    </div>
</section>`,
        },
        template: { path: '/modules/pages/views/htmlPageBlock' },
      },
    ],
  },
  {
    _id: '5ee40ef53f714a5486f6a2b9',
    headerMinimized: false,
    fullWidth: false,
    published: true,
    title: 'Account Verified',
    subtitle: '',
    url: '/verify-email/success',
    blocks: [
      {
        _id: '5ee40ef53f714a5486f6a2ba',
        name: 'HTML',
        props: {
          html: `<div class="rs-grid-container"><section class="section"><h3 style="text-align: center;">
Thank You For Verifying!</h3><p style="text-align: center;">&nbsp;</p><p style="text-align: center;"><br />
<strong>Your Account has been successfully verified.</strong></p><p>&nbsp;</p><p>&nbsp;</p>
<p style="text-align: center;"><a class="rs-btn rs-btn-ghost white" href="/">Go To 
Home Page </a></p><p>&nbsp;</p></section></div>`,
        },
        template: { path: '/modules/pages/views/htmlPageBlock' },
      },
    ],
    template: 'standard',
    background: '',
    headerBackground: '',
    language: 'en',
    meta: {},
  },
  {
    _id: '5ee40f733f714a5486f6a2bb',
    headerMinimized: false,
    fullWidth: false,
    published: true,
    title: 'Account Verification Error',
    subtitle: '',
    url: '/verify-email/error',
    blocks: [
      {
        _id: '5ee40f733f714a5486f6a2bc',
        name: 'HTML',
        props: {
          html: `<div class="rs-grid-container"><section class="section"><p>&nbsp</p><p style="text-align: center;">
<strong>Your Account verification has failed. Please contact us and we will try to help you.</strong></p><p>&nbsp;</p>
<p>&nbsp;</p><p style="text-align: center;">
<a class="rs-btn rs-btn-ghost white" href="/contact-us">Contact Us</a></p>
<p style="text-align: center;">&nbsp;</p></section></div>`,
        },
        template: { path: '/modules/pages/views/htmlPageBlock' },
      },
    ],
    template: 'standard',
    background: '',
    headerBackground: '',
    language: 'en',
    meta: {},
  },
];
