/**
 select 联动
 **/
(function ($) {
    "use strict";

    var SelectLink = function (options) {
        this.init('selectLink', options, SelectLink.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(SelectLink, $.fn.editabletypes.list);

    $.extend(SelectLink.prototype, {
        /**
         Renders input from tpl

         @method render()
         **/
        /*render: function() {
            this.$input = this.$tpl.find('select');
        },*/
        renderList: function() {
            this.$input.empty();

            var fillItems = function($el, data) {
                var attr, parent = $($el[0]);
                if($.isArray(data)) {
                    for(var i=0; i<data.length; i++) {
                        if(data[i].name && data[i].name !== '请选择'){
                            attr = {};
                            attr.value = data[i].value;
                            if(data[i].disabled) {
                                attr.disabled = true;
                            }
                            //console.log(data[i].sub);
                            parent.append($('<option>', attr).text(data[i].name).attr('sub', JSON.stringify(data[i].sub) ));
                        }
                    }
                }
                return $el;
            };

            fillItems(this.$input, this.sourceData);

            this.setClass();

            //enter submit
            this.$input.on('keydown.editable', function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
            });
            $(this.$input[0]).on("click", {sub:this.$input[1]}, function (event, value) {
                var $sub = $(event.data.sub);
                var sub = $(event.target).children("option:selected");
                try {
                    var subs = JSON.parse(sub.length === 1 ? sub.attr("sub") : $(event.target).children("option:first").attr("sub"));
                    $sub.empty();
                    for(var s = 0; s < subs.length; s++){
                        var attr = {};
                        attr.value = subs[s].id || subs[s].value;
                        if(subs[s].id === value || subs[s].name == value) {
                            attr.selected = true;
                        }
                        $sub.append($('<option>', attr).text(subs[s].name));
                    }
                } catch (e){
                    console.log(e);
                }

            }).trigger("click");
        },

        /**
         Default method to show value in element. Can be overwritten by display option.

         @method value2html(value, element)
         **/
        value2html: function(value, element) {
            if(!value) {
                $(element).empty();
                return;
            }
            if(value != ","){
                //console.log(value);
                value = value.split(",");
                value = [this.$input.filter('[name="parent"]').find("option[value='" + value[0] + "']").text(),this.$input.filter('[name="sub"]').find("option[value='" + value[1] + "']").text()];
                var html = value[0].length === 0 ? "" : $('<div>').text(value[0]).html() + ', ' + $('<div>').text(value[1]).html();
                $(element).html(html);
            }
        },

        /**
         Gets value from element's html

         @method html2value(html)
         **/
        html2value: function(html) {
            /*
             you may write parsing method to get value by element's html
             e.g. "Moscow, st. Lenina, bld. 15" => {city: "Moscow", street: "Lenina", building: "15"}
             but for complex structures it's not recommended.
             Better set value directly via javascript, e.g.
             editable({
             value: {
             city: "Moscow",
             street: "Lenina",
             building: "15"
             }
             });
             */
            return null;
        },

        /**
         Converts value to string.
         It is used in internal comparing (not for sending to server).

         @method value2str(value)
         **/
        value2str: function(value) {
            //console.log("value2str :" + value);
            var str = '';
            if(value) {
                for(var k in value) {
                    str = str + k + ':' + value[k] + ';';
                }
            }
            //console.log("value2str :" + str);
            return str;
        },

        /*
         Converts string to value. Used for reading value from 'data-value' attribute.

         @method str2value(str)
         */
        str2value: function(str) {
            /*
             this is mainly for parsing value defined in data-value attribute.
             If you will always set value by javascript, no need to overwrite it
             */
            return str;
        },

        /**
         标签.

         @method value2input(value)
         @param {mixed} value
         **/
        value2input: function(value) {
            if(!value) {
                return;
            }
            if(!(value == ",")) {
                value = value.split(",");
                if (value[0].length === 32) {
                    this.$input.filter('[name="parent"]').val(value[0]).trigger("click", value[1]);
                } else {
                    this.$input.filter('[name="parent"]').children().each(function (index, item) {
                        if(item.innerHTML == value[0]){
                            item.selected = true;
                        }
                    });
                    this.$input.filter('[name="parent"]').val(value[0]).trigger("click", value[1]);
                }
            }
        },

        /**
         Returns value of input.

         @method input2value()
         **/
        input2value: function() {
            return this.$input.filter('[name="parent"]').val() + "," + this.$input.filter('[name="sub"]').val();
        },

        /**
         Activates input: sets focus on the first field.

         @method activate()
         **/
        activate: function() {
            this.$input.filter('[name="parent"]').focus();
        },

        /**
         Attaches handler to submit form in case of 'showbuttons=false' mode

         @method autosubmit()
         **/
        autosubmit: function() {
            this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
            });
        }
    });

    SelectLink.defaults = $.extend({}, $.fn.editabletypes.list.defaults, {
        tpl: '<select class="form-control" name="parent"></select><select class="form-control" name="sub"></select>'
    });

    $.fn.editabletypes.selectLink = SelectLink;

}(window.jQuery));
