var menu = (function () {
    'use strict';

    var contentList = [];

    var buildMenuElem = function (menu, parent) {
        var ul = document.createElement('ul');

        for (var i = 0; i < menu.length; i++) {
            var li = document.createElement('li'),
                anchor = document.createElement('a');

            anchor.setAttribute('id', menu[i].id);
            anchor.setAttribute('class', menu[i].cssClass);
            anchor.href = '#';
            anchor.textContent = menu[i].description;

            li.appendChild(anchor);

            if (!menu[i].leaf) {
                // Recursively build the sub menu
                var subMenu = buildMenuElem(menu[i].menu, li);

                // Hide submenu as default
                animate.hide(subMenu);

                // Click event handler to show/hide an item with a sub menu
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    animate.toggle(this.nextSibling);
                });

                // Append sub menu to parent
                li.appendChild(subMenu);
            } else {
                // Add content to array for lookup
                contentList[menu[i].id] = menu[i].content;

                anchor.addEventListener('click', function () {
                    document.getElementById('content').textContent = contentList[this.id];
                });
            }

            ul.appendChild(li);
        }

        // Add sub menu to parent menu if being invoked recursively, otherwise, return menu element
        return (parent !== undefined) ? parent.appendChild(ul) : ul;
    };

    return {
        init: function () {
            httpService.get({ url: './menu.json' }, function (resp) {
                if (resp.status === 200) {
                    var m = JSON.parse(resp.responseText),
                        menuElem = buildMenuElem(m.menu);

                    document.getElementById('menu').appendChild(menuElem);
                } else {
                    alert('Error: Unable to load menu.');
                }
            });
        }
    };
})();

// For simplicity, initializing the menu here.
// Ideally, should be centrally ran from an app.js file or similar.
menu.init();