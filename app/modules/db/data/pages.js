module.exports = [
  {
    title: 'Welcome to Taboo CMS',
    url: '/',
    template: 'standard',
    published: true,
    language: 'en',
    blocks: [
      {
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
    title: 'About',
    url: '/about',
    template: 'standard',
    published: true,
    language: 'en',
    blocks: [
      {
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
    title: 'Contact',
    url: '/contact',
    template: 'standard',
    published: true,
    language: 'en',
    blocks: [
      {
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
    title: 'User Agreement',
    url: '/user-agreement',
    template: 'standard',
    published: true,
    language: 'en',
    blocks: [
      {
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
    title: 'Privacy Policy',
    url: '/privacy-policy',
    template: 'standard',
    published: true,
    language: 'en',
    blocks: [
      {
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
];
