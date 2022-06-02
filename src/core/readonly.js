/**
 * @fileOverview
 *
 * 只读模式支持
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function(require, exports, module) {
    var kity = require('./kity');
    var Minder = require('./minder');
    var MinderEvent = require('./event');

    let _disabled = false;
    Minder.registerInitHook(function(options) {
        if (options.readOnly) {
            _disabled = true;
            try {
                this.setDisabled();
            } catch (err) {
                console.log(err.message);
            }
        }
    });

    kity.extendClass(Minder, {
        isDisabled: function() {
            return _disabled;
        },

        disable: function() {
            _disabled = true;
            var me = this;
            //禁用命令
            me.bkqueryCommandState = me.queryCommandState;
            me.bkqueryCommandValue = me.queryCommandValue;
            me.queryCommandState = function(type) {
                var cmd = this._getCommand(type);
                if (cmd && cmd.enableReadOnly) {
                    return me.bkqueryCommandState.apply(me, arguments);
                }
                return -1;
            };
            me.queryCommandValue = function(type) {
                var cmd = this._getCommand(type);
                if (cmd && cmd.enableReadOnly) {
                    return me.bkqueryCommandValue.apply(me, arguments);
                }
                return null;
            };
            this.setStatus('readonly');
            me._interactChange();
        },

        enable: function() {
            var me = this;

            if (me.bkqueryCommandState) {
                me.queryCommandState = me.bkqueryCommandState;
                delete me.bkqueryCommandState;
            }
            if (me.bkqueryCommandValue) {
                me.queryCommandValue = me.bkqueryCommandValue;
                delete me.bkqueryCommandValue;
            }

            this.setStatus('normal');

            me._interactChange();
        }
    });
});