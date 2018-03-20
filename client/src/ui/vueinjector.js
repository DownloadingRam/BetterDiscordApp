/**
 * BetterDiscord Vue Injector Module
 * Copyright (c) 2015-present Jiiks/JsSucks - https://github.com/Jiiks / https://github.com/JsSucks
 * All rights reserved.
 * https://betterdiscord.net
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
*/

import Vue from './vue';

export default class {

    /**
     * Creates a new Vue object and mounts it in the passed element.
     * @param {HTMLElement} root The element to mount the new Vue object at
     * @param {Object} options Options to pass to Vue
     * @param {BdNode} bdnode The element to append to
     * @return {Vue}
     */
    static inject(root, options, bdnode) {
        if(bdnode) bdnode.appendTo(root);

        const vue = new Vue(options);

        vue.$mount(bdnode || root);
        return vue;
    }

}
