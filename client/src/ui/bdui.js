/**
 * BetterDiscord Client UI Module
 * Copyright (c) 2015-present Jiiks/JsSucks - https://github.com/Jiiks / https://github.com/JsSucks
 * All rights reserved.
 * https://betterdiscord.net
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
*/

import DOM from './dom';
import Vue from './vue';
import { BdSettingsWrapper } from './components';
import BdModals from './components/bd/BdModals.vue';
import { Events, WebpackModules } from 'modules';
import { Utils } from 'common';

export default class {

    static initUiEvents() {
        const defer = setInterval(() => {
            if (!this.profilePopupModule) return;
            clearInterval(defer);

            Utils.monkeyPatch(this.profilePopupModule, 'open', 'after', (data, userid) => Events.emit('ui-event', {
                event: 'profile-popup-open',
                data: { userid }
            }));
        }, 100);
        // This is temporary
        const locationInterval = setInterval(() => {
            try {
                const path = window.location.pathname.match(/\d+/g);
                if (!path) {
                    this.prevLocation = null;
                    Events.emit('server-switch');
                    return;
                }
                const ids = path.reduce((obj, el, index) => {
                        obj[index === 0 ? 'guildId' : 'channelId'] = el;
                        return obj;
                    },
                    {});

                if (Object.keys(ids).length === 1) {
                    ids.isDm = true;
                    ids.dmId = ids.guildId
                }

                if (!this.prevLocation) {
                    Events.emit('server-switch');
                } else {
                    if (this.prevLocation.channelId !== ids.channelId) {
                        Events.emit('channel-switch');
                    } else if (this.prevLocation.guildId !== ids.guildId) {
                        Events.emit('server-switch');
                    }
                }
                this.prevLocation = ids;
            } catch (err) {
                console.log(err);
            }
        }, 100);
    }

    static get profilePopupModule() {
        return WebpackModules.getModuleByProps(['fetchMutualFriends', 'setSection']);
    }

    static injectUi() {
        DOM.createElement('div', null, 'bd-settings').appendTo(DOM.bdBody);
        DOM.createElement('div', null, 'bd-modals').appendTo(DOM.bdModals);
        DOM.createElement('bd-tooltips').appendTo(DOM.bdBody);

        const modals = new Vue({
            el: '#bd-modals',
            components: { BdModals },
            template: '<BdModals/>'
        });

        const vueInstance = new Vue({
            el: '#bd-settings',
            components: { BdSettingsWrapper },
            template: '<BdSettingsWrapper/>'
        });

        return vueInstance;
    }
}
