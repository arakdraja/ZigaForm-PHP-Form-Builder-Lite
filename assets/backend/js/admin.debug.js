;var $uifm_prev = jQuery.noConflict();

;var $uifm=jQuery.noConflict();



if (typeof $uifm === 'undefined') {
	$uifm = jQuery;
}
var uiform_is_dragging = false;
var uiform_is_children = false;
var rocketform = rocketform || null;

if (!$uifm.isFunction(rocketform)) {
	(function ($, window) {
		window.rocketform = rocketform = $.rocketform = function () {
			var uifmvariable = [];
			uifmvariable.innerVars = {};
			uifmvariable.setfield_tab_active = '';
			uifmvariable.fields_flag_stored = [];

			var mainrformb = {
				app_ver: '1.6.3',
				main: {
					submit_ajax: '1',
					add_css: '',
					add_js: '',
					onload_scroll: '0',
					preload_noconflict: '1',
					pdf_charset: 'UTF-8',
					pdf_font: '2',
					pdf_paper_size: 'a4',
					pdf_paper_orie: 'landscape',
					pdf_html_fullpage: '0',
					email_html_fullpage: '0',
					email_dissubm: '0'
				},
				skin: {
					form_width: {
						show_st: '0',
						max: '800'
					},
					form_padding: {
						show_st: '1',
						pos_top: '20',
						pos_right: '17',
						pos_bottom: '20',
						pos_left: '17'
					},
					form_background: {
						show_st: '1',
						type: '1',
						start_color: '#eeeeee',
						end_color: '#ffffff',
						solid_color: '#ffffff',
						image: ''
					},
					form_border_radius: {
						show_st: '0',
						size: '5'
					},
					form_border: {
						show_st: '0',
						color: '#000',
						style: '1',
						width: '1'
					},
					form_shadow: {
						show_st: '1',
						color: '#CCCCCC',
						h_shadow: '3',
						v_shadow: '3',
						blur: '10'
					}
				},
				wizard: {
					enable_st: '0',
					theme_type: 0,
					theme: {
						0: {
							skin_tab_cur_bgcolor: '#4798E7',
							skin_tab_cur_txtcolor: '#ffffff',
							skin_tab_cur_numtxtcolor: '#4798E7',
							skin_tab_inac_bgcolor: '#ECF0F1',
							skin_tab_inac_txtcolor: '#95A5A6',
							skin_tab_inac_numtxtcolor: '#ECF0F1',
							skin_tab_done_bgcolor: '#9a8afa',
							skin_tab_done_txtcolor: '#ffffff',
							skin_tab_done_numtxtcolor: '#ECF0F1',
							skin_tab_cont_bgcolor: '#F9F9F9',
							skin_tab_cont_borcol: '#D4D4D4'
						},
						1: {
							skin_tab_cur_bgcolor: '#4798E7',
							skin_tab_cur_txtcolor: '#000000',
							skin_tab_cur_numtxtcolor: '#4798E7',
							skin_tab_cur_bg_numtxt: '#ffffff',
							skin_tab_inac_bgcolor: '#cccccc',
							skin_tab_inac_txtcolor: '#95A5A6'
						}
					}
				},
				onsubm: {
					sm_successtext: '<div class="rockfm-alert rockfm-alert-success" role="alert">Success! Form was sent successfully.</div>',
					sm_boxmsg_bg_st: '0',
					sm_boxmsg_bg_type: '1',
					sm_boxmsg_bg_solid: '',
					sm_boxmsg_bg_start: '',
					sm_boxmsg_bg_end: '',
					sm_redirect_st: '0',
					sm_redirect_url: '',
					mail_from_email: '',
					mail_from_name: '',
					mail_template_msg: '',
					mail_recipient: '',
					mail_cc: '',
					mail_bcc: '',
					mail_subject: '',
					mail_usr_st: '0',
					mail_usr_template_msg: '',
					mail_usr_pdf_st: '0',
					mail_usr_pdf_store: '0',
					mail_usr_pdf_template_msg: '',
					mail_usr_pdf_fn: '',
					mail_usr_recipient: '',
					mail_usr_recipient_name: '',
					mail_usr_cc: '',
					mail_usr_bcc: '',
					mail_usr_subject: ''
				},
				num_tabs: 1,
				steps: {
					tab_title: [],
					tab_cont: []
				},
				steps_src: []
			};

			function initialize() {
				enableDraggableItems();
				enableSortableItems();
			}

			arguments.callee.backend_init_load = function () {
				initialize();
			};

			function enableDraggableItems() {
				$('ul.uiform-list-fields a')
					.draggable({
						connectToSortable: '.uiform-items-container',
						helper: 'clone',
						revert: 'invalid',
						distance: 0,
						cursorAt: { top: 20, left: 10 },
						cursor: 'move',
						handle: '.sfdc-btn1-icon-left',
						appendTo: '.uiform-main-form',
						drag: function (event, ui) {}
					})
					.disableSelection();
			}

			function enableSortableItems() {
				$('.uiform-items-container').sortable({
					placeholder: 'uiform-draggable-placeholder',
					connectWith: '.uiform-items-container',
					revert: false,

					helper: function (event, item) {
						var field_type = $(item).attr('data-typefield');
						var tmp_text = $('.uiform-builder-fields')
							.first()
							.find('a[data-type="' + field_type + '"]')
							.html();
						return $('<div class="zgpb-draggable-helper" style="width: 130px; height: 35px;">' + tmp_text + '</div>');
					},
					handle: '.uiform-field-move',
					sort: function (event, ui) {
						if (typeof ui.placeholder === 'undefined') {
							return;
						}

					},
					receive: function (event, ui) {
						var field_type = ui.item.data('type');

						if (!ui.item.attr('id')) {
							uiform_is_dragging = false;
							rocketform.showLoader(1, true, true);
							rocketform.getFieldsAfterDraggable(this, field_type, false, '');
						}
					},
					stop: function (event, ui) {
						if ($('#zgpb-editor-container').find('.zgpb-draggable-helper').length) {
							$('#zgpb-editor-container').find('.zgpb-draggable-helper').remove();
						}
						if ($('#zgpb-editor-container').find('.zgpb-fl-gs-block-style-hover').length) {
							$('#zgpb-editor-container').find('.zgpb-fl-gs-block-style-hover').removeClass('zgpb-fl-gs-block-style-hover');
						}

						if (uiform_is_dragging === true) {
							rocketform.hideLoader();
							if (uiform_is_children === true) {
								$(window).trigger('resize');
							}
						}
					},
					start: function (e, ui) {
						uiform_is_dragging = true;
						uiform_is_children = false;
						var id_field = ui.item.attr('id');

					},
					tolerance: 'pointer',
					opacity: 0.5
				});
			}

			function enableDroppableItems() {
				$('#uiform-items-container div').droppable({
					activeClass: 'ui-state-hover',
					hoverClass: 'ui-state-active',
					accept: '.uiform-draggable-field',
					drop: function (event, ui) {
						return;
						$(this).addClass('ui-state-highlight');
						if ($(ui.draggable).hasClass('uiform-draggable-field')) $(ui.draggable).clone().appendTo(this);
						else $(ui.draggable).appendTo(this);
					}
				});

			}
			arguments.callee.setInnerVariable = function (name, value) {
				uifmvariable.innerVars[name] = value;
			};
			arguments.callee.getInnerVariable = function (name) {
				if (uifmvariable.innerVars[name]) {
					return uifmvariable.innerVars[name];
				} else {
					return '';
				}
			};
			arguments.callee.generateUniqueID = function () {
				var number = Math.random(); 
				number.toString(36); 
				var id = number.toString(36).substr(2, 9); 
				return id;
			};
			arguments.callee.generateSuffixID = function (min, max) {
				return Math.floor(Math.random() * (max - min + 1) + min);
			};

			arguments.callee.setUiVar = function (name, value) {
				uivars[name] = value;
			};
			arguments.callee.setUiArray = function (name, id, value) {
				uivars[name][id] = value;
			};
			arguments.callee.getUiArray = function (name, id) {
				return uivars[name][id];
			};
			arguments.callee.getUiVar = function (name) {
				return uivars[name];
			};
			arguments.callee.getFieldById = function (id) {
				return uivars['fields'][id];
			};
			arguments.callee.getFieldArray = function (id, name) {
				return uivars['fields'][id][name];
			};
			arguments.callee.showLoader = function (type, is_loading, is_fading) {
				switch (parseInt(type)) {
					case 2:
						rocketform.alerts_msg(3, $('#alert_header_msg_processing').val());
						break;
					case 3:
						rocketform.alerts_msg(1, $('#alert_header_saving').val());
						break;
					case 4:
						rocketform.alerts_msg(3, $('#alert_header_msg_removing').val());
						break;
					case 5:
						rocketform.alerts_msg(1, $('#alert_header_form_saved').val());
						break;
					case 1:
					default:
						rocketform.alerts_msg(2, $('#alert_header_loading').val());
						break;
				}

				if (is_loading) {
					$('#uifm-loading-box').find('.sfdc-alert').append(' <span class="uifm-loader-header-1"></span>');
				} else {
					$('#uifm-loading-box').find('.uifm-loader-header-1').remove();
				}

				if (is_fading) {
					$('#uifm-loading-box')
						.fadeTo(2000, 500)
						.slideUp(500, function () {
							$('#uifm-loading-box').slideUp(500);
						});
				} else {
					$('#uifm-loading-box').show();
				}

				$('#uifm-loading-box').show();
			};
			arguments.callee.hideLoader = function () {
				$('#uifm-loading-box').hide();
				$('#uifm-loading-box').find('.alert').attr('class', 'alert').html('');
			};
			arguments.callee.loading_boxField = function (id, st) {
				if (parseInt(st) === 1) {
					$('<div class="uiform-field-loadingst"><div class="zgpb-loader-header-1"></div></div>').appendTo($('#' + id).css('position', 'relative'));
				} else {
					$('#' + id)
						.find('.uiform-field-loadingst')
						.remove();
				}
			};

			arguments.callee.loading_panelbox2 = function (st) {
				if (parseInt(st) === 1) {
					$('#uiform-panel-loadingst').parent().css('position', 'relative');
					$('#uiform-panel-loadingst').show();
				} else {
					$('#uiform-panel-loadingst').parent().removeCss('position', 'relative');
					$('#uiform-panel-loadingst').hide();
				}
			};

			arguments.callee.loading_panelbox = function (id, st) {
				if (parseInt(st) === 1) {
					$('#' + id).show('fast', function () {
						$(window).trigger('resize');
					});
				} else {
					$('#uiform-panel-loadingst').hide();
				}
			};
			arguments.callee.alerts_global_msg = function (type, txt_msg) {
				var rockfm_class;
				switch (parseInt(type)) {
					case 1:
						rockfm_class = 'alert-success';
						break;
					case 2:
						rockfm_class = 'alert-info';
						break;
					case 3:
						rockfm_class = 'alert-warning';
						break;
					case 4:
						rockfm_class = 'alert-danger';
						break;
				}
				var content = '';
				content += '<div class="alert ' + rockfm_class + '">';
				content += '<a href="#" class="close" data-dismiss="alert">&times;</a>';
				content += txt_msg;
				content += '</div>';

				return content;
			};
			arguments.callee.alerts_msg = function (type, txt_msg) {
				var rockfm_class;
				switch (parseInt(type)) {
					case 1:
						rockfm_class = 'uifm-alert-success';
						break;
					case 2:
						rockfm_class = 'uifm-alert-info';
						break;
					case 3:
						rockfm_class = 'uifm-alert-warning';
						break;
					case 4:
						rockfm_class = 'uifm-alert-danger';
						break;
				}
				$('#uifm-loading-box')
					.find('.uifm-alert')
					.attr('class', 'uifm-alert ' + rockfm_class)
					.html(txt_msg)
					.append(' <span class="uifm-loader-header-1"></span>');
			};
			arguments.callee.setHighlightPicked = function (obj) {
				if ($(document).find('.uifm-highlight-edited')) {
					$(document).find('.uifm-highlight-edited').removeClass('uifm-highlight-edited');
				}
				obj.addClass('uifm-highlight-edited');
			};
			arguments.callee.getUiData = function (name) {
				return mainrformb[name];
			};
			arguments.callee.setUiData = function (name, value) {
				mainrformb[name] = value;
			};
			arguments.callee.getUiData2 = function (name, index) {
				try {
					return mainrformb[name][index];
				} catch (err) {
					console.log('error getUiData2: ' + err.message);
				}
			};

			arguments.callee.delUiData2 = function (name, index) {
				delete mainrformb[name][index];
			};

			arguments.callee.spliceUiData2 = function (name, index) {
				if (parseInt(index) > -1) {
					mainrformb[name].splice(parseInt(index), 1);
				}
			};

			arguments.callee.setUiData2 = function (name, index, value) {
				if (!mainrformb.hasOwnProperty(name)) {
					mainrformb[name] = {};
				}
				if (!mainrformb[name].hasOwnProperty(index)) {
					mainrformb[name][index] = {};
				}
				mainrformb[name][index] = value;
			};
			arguments.callee.addIndexUiData2 = function (name, index, value) {
				if (typeof mainrformb[name][index] == 'undefined') {
				} else {
					mainrformb[name][index][value] = {};
				}
			};
			arguments.callee.getUiData3 = function (name, index, key) {
				try {
					return mainrformb[name][index][key];
				} catch (err) {
					console.log('error getUiData3: ' + err.message);
				}
			};
			arguments.callee.delUiData3 = function (name, index, key) {
				delete mainrformb[name][index][key];
			};

			arguments.callee.spliceUiData3 = function (name, index, key) {
				if (parseInt(key) > -1) {
					mainrformb[name][index].splice(parseInt(key), 1);
				}
			};

			arguments.callee.setUiData3 = function (name, index, key, value) {
				if (!mainrformb.hasOwnProperty(name)) {
					mainrformb[name] = {};
				}
				if (!mainrformb[name].hasOwnProperty(index)) {
					mainrformb[name][index] = {};
				}

				mainrformb[name][index][key] = value;
			};
			arguments.callee.setUiData4 = function (name, index, key, option, value) {
				if (!mainrformb.hasOwnProperty(name)) {
					mainrformb[name] = {};
				}
				if (!mainrformb[name].hasOwnProperty(index)) {
					mainrformb[name][index] = {};
				}

				if (!mainrformb[name][index].hasOwnProperty(key)) {
					mainrformb[name][index][key] = {};
				}

				mainrformb[name][index][key][option] = value;
			};
			arguments.callee.getUiData4 = function (name, index, key, option) {
				try {
					return mainrformb[name][index][key][option];
				} catch (err) {
					console.log('error getUiData4: name: ' + name + ' index:' + index + ' key:' + key + ' option:' + option + ' error:' + err.message);
				}
			};
			arguments.callee.getUiData5 = function (name, index, key, section, option) {
				try {
					if (typeof mainrformb[name][index] == 'undefined') {
						return '';
					} else {
						return mainrformb[name][index][key][section][option];
					}
				} catch (err) {
					console.log('error getUiData5: ' + err.message);
					return '';
				}
			};
			arguments.callee.setUiData5 = function (name, index, key, section, option, value) {
				if (!mainrformb.hasOwnProperty(name)) {
					mainrformb[name] = {};
				}
				if (!mainrformb[name].hasOwnProperty(index)) {
					mainrformb[name][index] = {};
				}

				if (!mainrformb[name][index].hasOwnProperty(key)) {
					mainrformb[name][index][key] = {};
				}

				if (!mainrformb[name][index][key].hasOwnProperty(section)) {
					mainrformb[name][index][key][section] = {};
				}

				mainrformb[name][index][key][section][option] = value;
			};
			arguments.callee.addIndexUiData5 = function (name, index, key, section, option, value) {
				if (typeof mainrformb[name][index][key][section][option] == 'undefined') {
				} else {
					mainrformb[name][index][key][section][option][value] = {};
				}
			};

			arguments.callee.getUiData6 = function (name, index, key, section, option, option2) {
				try {
					if (typeof mainrformb[name][index][key][section][option][option2] == 'undefined') {
						return '';
					} else {
						return mainrformb[name][index][key][section][option][option2];
					}
				} catch (err) {
					console.log('error handled - getUiData6: ' + err.message);
					return '';
				}
			};

			arguments.callee.setUiData6 = function (name, index, key, section, option, option2, value) {
				if (!mainrformb.hasOwnProperty(name)) {
					mainrformb[name] = {};
				}
				if (!mainrformb[name].hasOwnProperty(index)) {
					mainrformb[name][index] = {};
				}

				if (!mainrformb[name][index].hasOwnProperty(key)) {
					mainrformb[name][index][key] = {};
				}

				if (!mainrformb[name][index][key].hasOwnProperty(section)) {
					mainrformb[name][index][key][section] = {};
				}

				if (!mainrformb[name][index][key][section].hasOwnProperty(option)) {
					mainrformb[name][index][key][section][option] = {};
				}

				mainrformb[name][index][key][section][option][option2] = value;
			};

			arguments.callee.delUiData6 = function (name, index, key, section, option, option2) {
				delete mainrformb[name][index][key][section][option][option2];
			};

			arguments.callee.getUiData7 = function (name, index, key, section, option, option2, option3) {
				try {
					if (typeof mainrformb[name][index][key][section][option][option2][option3] == 'undefined') {
						return '';
					} else {
						return mainrformb[name][index][key][section][option][option2][option3];
					}
				} catch (err) {
					console.log('error handled - getUiData7: ' + err.message);
					return '';
				}
			};
			arguments.callee.setUiData7 = function (name, index, key, section, option, option2, option3, value) {
				if (!mainrformb.hasOwnProperty(name)) {
					mainrformb[name] = {};
				}
				if (!mainrformb[name].hasOwnProperty(index)) {
					mainrformb[name][index] = {};
				}

				if (!mainrformb[name][index].hasOwnProperty(key)) {
					mainrformb[name][index][key] = {};
				}

				if (!mainrformb[name][index][key].hasOwnProperty(section)) {
					mainrformb[name][index][key][section] = {};
				}

				if (!mainrformb[name][index][key][section].hasOwnProperty(option)) {
					mainrformb[name][index][key][section][option] = {};
				}

				if (!mainrformb[name][index][key][section][option].hasOwnProperty(option2)) {
					mainrformb[name][index][key][section][option][option2] = {};
				}

				mainrformb[name][index][key][section][option][option2][option3] = value;
			};
			arguments.callee.addIndexUiData7 = function (name, index, key, section, option, option2, value) {
				if (typeof mainrformb[name][index][key][section][option][option2] == 'undefined') {
				} else {
					mainrformb[name][index][key][section][option][option2][value] = {};
				}
			};
			arguments.callee.setUiData8 = function (name, index, key, section, option, option2, option3, option4, value) {
				if (!mainrformb.hasOwnProperty(name)) {
					mainrformb[name] = {};
				}
				if (!mainrformb[name].hasOwnProperty(index)) {
					mainrformb[name][index] = {};
				}

				if (!mainrformb[name][index].hasOwnProperty(key)) {
					mainrformb[name][index][key] = {};
				}

				if (!mainrformb[name][index][key].hasOwnProperty(section)) {
					mainrformb[name][index][key][section] = {};
				}

				if (!mainrformb[name][index][key][section].hasOwnProperty(option)) {
					mainrformb[name][index][key][section][option] = {};
				}

				if (!mainrformb[name][index][key][section][option].hasOwnProperty(option2)) {
					mainrformb[name][index][key][section][option][option2] = {};
				}

				if (!mainrformb[name][index][key][section][option][option2].hasOwnProperty(option3)) {
					mainrformb[name][index][key][section][option][option2][option3] = {};
				}

				mainrformb[name][index][key][section][option][option2][option3][option4] = value;
			};
			arguments.callee.addIndexUiData8 = function (name, index, key, section, option, option2, option3, value) {
				if (typeof mainrformb[name][index][key][section][option][option2][option3] == 'undefined') {
				} else {
					mainrformb[name][index][key][section][option][option2][option3][value] = {};
				}
			};
			arguments.callee.delUiData8 = function (name, index, key, section, option, option2, option3, option4) {
				delete mainrformb[name][index][key][section][option][option2][option3][option4];
			};

			arguments.callee.setUiData9 = function (name, index, key, section, option, option2, option3, option4, option5, value) {
				if (!mainrformb.hasOwnProperty(name)) {
					mainrformb[name] = {};
				}
				if (!mainrformb[name].hasOwnProperty(index)) {
					mainrformb[name][index] = {};
				}

				if (!mainrformb[name][index].hasOwnProperty(key)) {
					mainrformb[name][index][key] = {};
				}

				if (!mainrformb[name][index][key].hasOwnProperty(section)) {
					mainrformb[name][index][key][section] = {};
				}

				if (!mainrformb[name][index][key][section].hasOwnProperty(option)) {
					mainrformb[name][index][key][section][option] = {};
				}

				if (!mainrformb[name][index][key][section][option].hasOwnProperty(option2)) {
					mainrformb[name][index][key][section][option][option2] = {};
				}

				if (!mainrformb[name][index][key][section][option][option2].hasOwnProperty(option3)) {
					mainrformb[name][index][key][section][option][option2][option3] = {};
				}

				if (!mainrformb[name][index][key][section][option][option2][option3].hasOwnProperty(option4)) {
					mainrformb[name][index][key][section][option][option2][option3][option4] = {};
				}
				mainrformb[name][index][key][section][option][option2][option3][option4][option5] = value;
			};

			arguments.callee.checkIntegrityDataField = function (id) {
				var status = false;
				try {

					if ('.uiform-step-content #' + id) {
						var f_step = $('#' + id)
							.closest('.uiform-step-pane')
							.data('uifm-step');

						if (typeof mainrformb['steps_src'][parseInt(f_step)][id] == 'undefined') {
							status = false;
						} else {
							status = true;
						}
					} else {
						status = false;
					}
					return status;
				} catch (err) {
					console.log('error handled - checkIntegrityDataField : ' + err.message);
					return false;
				}
			};

			arguments.callee.dumpvar3 = function (object) {
				return JSON.stringify(object, null, 2);
			};
			arguments.callee.dumpvar2 = function (object) {
				return JSON.stringify(object);
			};

			arguments.callee.dumpvar = function (object) {
				var seen = [];
				var json = JSON.stringify(object, function (key, val) {
					if (val != null && typeof val == 'object') {
						if (seen.indexOf(val) >= 0) return;
						seen.push(val);
					}
					return val;
				});
				return seen;
			};

			arguments.callee.checkScrollTab = function () {
				var tablist = $('.uiform-set-options-tabs').find('ul.sfdc-nav-tabs');
				var currentWidth = 0;
				tablist.find('li').each(function (i) {
					currentWidth = currentWidth + parseInt($(this).width());
				});
				if (currentWidth > 480) {
					$('.uiform-set-options-tabs').find('.uifm-tab-navigation').show();
				} else {
					$('.uiform-set-options-tabs').find('.uifm-tab-navigation').hide();
				}
			};
			arguments.callee.setScrollTab = function (offset, element) {
				var tablist = $(element).parent().parent().parent().find('ul.sfdc-nav-tabs');
				var currentScroll;
				currentScroll = tablist.css('left');
				currentScroll.replace('px', '');
				if (offset > 0) {
					currentScroll = parseInt(currentScroll) + 10;
				} else {
					currentScroll = parseInt(currentScroll) - 10;
				}
				var currentWidth = 0;
				tablist.find('li').each(function (i) {
					currentWidth = currentWidth + parseInt($(this).width());
				});
				if (currentScroll > 0) {
					currentScroll = 0;
				}
				var checkLimitNext = currentWidth + currentScroll;
				if (checkLimitNext < 410) {
					currentScroll = parseInt(currentScroll) + 10;
				}
				tablist.css('left', currentScroll + 'px');
			};
			arguments.callee.cleanSettingTab = function () {
				var clvars;
				clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-misc',
					'.uifm-tab-fld-appendimgs',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-inputtextbox',
					'.uifm-set-section-input12boxbg',
					'.uifm-set-section-input13boxbg',
					'.uifm-set-section-input-placeh',
					'.uifm-set-section-input-valign',
					'.uifm-set-section-input-objalign',
					'.uifm-set-section-inputboxbg',
					'.uifm-set-section-inputboxborder',
					'.uifm-set-section-input12boxborder',
					'.uifm-set-section-input13boxborder',
					'.uifm-set-section-input2',
					'.uifm-set-section-input3',
					'.uifm-set-section-input4',
					'.uifm-set-section-input4-skin-maxwidth',
					'.uifm-set-section-input5',
					'.uifm-set-section-input6',
					'.uifm-set-section-input7',
					'.uifm-set-section-input8',
					'.uifm-set-section-input9',
					'.uifm-set-section-input11',
					'.uifm-set-section-input12',
					'.uifm-set-section-input13',
					'.uifm-set-section-input14',
					'.uifm-set-section-input15',
					'.uifm-set-section-input16',
					'.uifm-set-section-input17',
					'.uifm-set-section-input18',
					'#uifm-fld-inp-date2-box',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'.zgfm-set-section-custominput-box',
					'#uifm-custom-val-req-btn',
					'#uifm-custom-val-alpha-btn',
					'#uifm-custom-val-alphanum-btn',
					'#uifm-custom-val-num-btn',
					'#uifm-custom-val-mail-btn',
					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-inputprepend',
					'.uifm-set-section-inputappend',
					'.uifm-set-section-input4-range',
					'.uifm-set-section-input4-defaultvalue',
					'.uifm-set-section-input4-spinner-opts',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-input1-txtvalue',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).addClass('uifm-hide');
				});
				$('#uifm_fld_main_fldname').val('');

				clvars = [
					'#uifm_fld_inp_align_1',
					'#uifm_fld_inp_align_2',
					'#uifm_fld_inp_align_3',
					'#uifm_fld_lbl_blo_pos_1',
					'#uifm_fld_lbl_blo_pos_2',
					'#uifm_fld_lbl_blo_pos_3',
					'#uifm_fld_lbl_blo_pos_4',

					'#uifm_fld_lbl_blo_align_1',
					'#uifm_fld_lbl_blo_align_2',
					'#uifm_fld_lbl_blo_align_3',
					'#uifm_fld_elbor_style_1',
					'#uifm_fld_elbor_style_2',
					'#uifm_fld_hblock_pos_1',
					'#uifm_fld_hblock_pos_2',
					'#uifm_fld_hblock_pos_3',
					'#uifm_fld_hblock_pos_4',
					'#uifm_fld_val_pos_1',
					'#uifm_fld_val_pos_2',
					'#uifm_fld_val_pos_3',
					'#uifm_fld_val_pos_4'
				];
				$.each(clvars, function () {
					$(String(this)).prop('checked', false);
					$(String(this)).parent().removeClass('sfdc-active');
				});
				clvars = ['#uifm_fld_val_reqicon_pos_2', '#uifm_fld_val_reqicon_pos_1'];
				$.each(clvars, function () {
					$(String(this)).prop('checked', false);
					$(String(this)).removeClass('sfdc-active');
				});
				clvars = ['#uifm-custom-val-req-custxt', '#uifm-custom-val-alpha-custxt', '#uifm-custom-val-alphanum-custxt', '#uifm-custom-val-numbers-custxt', '#uifm-custom-val-email-custxt'];
				$.each(clvars, function () {
					$(String(this)).val('');
				});
			};

			arguments.callee.closeSettingTab = function () {
				$('.sfdc-nav-tabs a[href="#uiform-build-form-tab"]').sfdc_tab('show');
				$('.sfdc-nav-tabs a[href="#uiform-settings-tab3-2"]').sfdc_tab('show');
				$('.uifm-tab-selectedfield').hide();
				$('#uifm-field-selected-id').val('');
			};

			arguments.callee.loadDataOptionByFieldId = function (id_field) {
				console.log('loadDataOptionByFieldId not using');
				return;
				var idselected = $('#uifm-field-selected-id').val();

				if (id_field === idselected) {
					var tabobject = $('#uifm-field-selected-id').parent();
					$.each(data_field, function (index, value) {
						if ($.isPlainObject(value)) {
							$.each(value, function (index2, value2) {
								rocketform.setDataOptToSetTab(tabobject, index, index2, value2);
							});
						}
					});
				}
			};
			arguments.callee.enableSettingTabOption = function (option) {
				switch (option) {
					case 'uifm-label':
					case 'uifm-sublabel':
						$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
						rocketform.setInnerVariable('setfield_tab_active', 'label');
						break;
					case 'uifm-txtbox-inp-val':
						$('.sfdc-nav-tabs a[href="#uiform-settings-tab-2"]').sfdc_tab('show');
						rocketform.setInnerVariable('setfield_tab_active', 'input');
						break;
					case 'uifm-help-block':
						$('.sfdc-nav-tabs a[href="#uiform-settings-tab-3"]').sfdc_tab('show');
						rocketform.setInnerVariable('setfield_tab_active', 'helpb');
						break;
					default:
				}
			};
			arguments.callee.setDataToSettingTab = function (id_field, data_field) {
				var idselected = $('#uifm-field-selected-id').val();
				var obj_field = $('#' + id_field);
				var f_store_a;
				if (id_field === idselected) {
					var tabobject = $('#uifm-field-selected-id').parent();
					$.each(data_field, function (index, value) {
						if ($.isPlainObject(value)) {
							$.each(value, function (index2, value2) {
								if ($.isPlainObject(value2)) {
									$.each(value2, function (index3, value3) {
										f_store_a = [];
										f_store_a.push(index);
										f_store_a.push(index2);
										f_store_a.push(index3);
										rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value3);
									});
								} else {
									f_store_a = [];
									f_store_a.push(index);
									f_store_a.push(index2);
									rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value2);
								}
							});
						}
					});
				}
			};
			arguments.callee.setDataToSettingTabAndPreview = function (id_field, data_field) {
				var idselected = $('#uifm-field-selected-id').val();
				var obj_field = $('#' + id_field);
				var f_store_a;
				if (id_field === idselected) {
					var tabobject = $('#uifm-field-selected-id').parent();

					$.each(data_field, function (index, value) {
						if ($.isPlainObject(value)) {
							$.each(value, function (index2, value2) {
								if ($.isPlainObject(value2)) {
									$.each(value2, function (index3, value3) {
										if ($.isPlainObject(value3)) {
											$.each(value3, function (index4, value4) {
												f_store_a = [];
												f_store_a.push(index);
												f_store_a.push(index2);
												f_store_a.push(index3);
												f_store_a.push(index4);

												rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value4);
												rocketform.setDataOptToPrevField(obj_field, f_store_a.join('-'), value4);
											});
										} else {
											f_store_a = [];
											f_store_a.push(index);
											f_store_a.push(index2);
											f_store_a.push(index3);

											rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value3);
											rocketform.setDataOptToPrevField(obj_field, f_store_a.join('-'), value3);
										}
									});
								} else {
									f_store_a = [];
									f_store_a.push(index);
									f_store_a.push(index2);

									rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value2);
									rocketform.setDataOptToPrevField(obj_field, f_store_a.join('-'), value2);
								}
							});
						} else {
							rocketform.setDataOptToSetTab_1(tabobject, index, value, data_field['type']);
						}
					});
				}
			};
			arguments.callee.loadForm_updatePreviewField = function (id_field, data_field) {
				try {
					var obj_field = $('#' + id_field);
					$.each(data_field, function (index, value) {
						if ($.isPlainObject(value)) {
							$.each(value, function (index2, value2) {
								if ($.isPlainObject(value2)) {
									$.each(value2, function (index3, value3) {
										rocketform.setDataOptToPrevField(obj_field, index + '-' + index2 + '-' + index3, value3);
									});
								} else {
									rocketform.setDataOptToPrevField(obj_field, index + '-' + index2, value2);
								}
							});
						}
					});
				} catch (e) {
					console.log('id_field:' + id_field + ' - error: ' + e.message);
				}
			};
			arguments.callee.setDataToPreviewField = function (id_field, data_field) {
				var obj_field = $('#' + id_field);
				if (obj_field) {
					$.each(data_field, function (index, value) {
						if ($.isPlainObject(value)) {
							$.each(value, function (index2, value2) {
								rocketform.setDataOptToPrevField(obj_field, index + '-' + index2, value2);
							});
						}
					});
				}
			};
			arguments.callee.setDataOptToCoreData = function (step, id, f_store, value) {
				try {
					var f_sec, f_opt, f_opt2, f_opt3, tmp_store;

					tmp_store = f_store.split('-');

					var length = tmp_store.length;

					f_sec = tmp_store[0];
					f_opt = tmp_store[1];
					f_opt2 = tmp_store[2] || null;

					switch (String(f_sec)) {
						case 'input18':
							f_opt2 = tmp_store[2] || '';
							this.setUiData6('steps_src', String(step), String(id), String(f_sec), String(f_opt), String(f_opt2), value);
							break;
						default:
							switch (parseInt(length)) {
								case 3:
									this.setUiData6('steps_src', String(step), String(id), String(f_sec), String(f_opt), String(f_opt2), value);
									break;
								case 2:
									this.setUiData5('steps_src', String(step), String(id), String(f_sec), String(f_opt), value);
									break;
							}

							break;
					}
				} catch (ex) {
					console.error('error setDataOptToCoreData ', ex.message);
				}
			};
			arguments.callee.previewform_shadowBox = function (obj) {
				var style, s_x, s_y, s_blur, s_st, s_color;


				s_st = this.getUiData3('skin', 'form_shadow', 'show_st');
				s_x = this.getUiData3('skin', 'form_shadow', 'h_shadow');
				s_y = this.getUiData3('skin', 'form_shadow', 'v_shadow');
				s_blur = this.getUiData3('skin', 'form_shadow', 'blur');
				s_color = this.getUiData3('skin', 'form_shadow', 'color');

				if (parseInt(s_st) === 1) {
					style = s_x + 'px ' + s_y + 'px ' + s_blur + 'px ' + s_color;
					obj.find('.uiform-main-form').css('box-shadow', style);
				} else {
					obj.find('.uiform-main-form').removeCss('box-shadow');
				}
			};
			arguments.callee.previewfield_shadowBox = function (obj, section, container) {
				var style, s_x, s_y, s_blur, s_st, s_color;

				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				s_st = this.getUiData5('steps_src', f_step, f_id, section, 'shadow_st');
				s_x = this.getUiData5('steps_src', f_step, f_id, section, 'shadow_x');
				s_y = this.getUiData5('steps_src', f_step, f_id, section, 'shadow_y');
				s_blur = this.getUiData5('steps_src', f_step, f_id, section, 'shadow_blur');
				s_color = this.getUiData5('steps_src', f_step, f_id, section, 'shadow_color');

				if (parseInt(s_st) === 1) {
					style = s_x + 'px ' + s_y + 'px ' + s_blur + 'px ' + s_color;
					obj.find(container).css('text-shadow', style);
				} else {
					obj.find(container).removeCss('text-shadow');
				}
			};
			arguments.callee.previewfield_elementBorderRadius = function (obj, section, inputClass) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var show_st = this.getUiData5('steps_src', f_step, f_id, section, 'show_st');
				var size = this.getUiData5('steps_src', f_step, f_id, section, 'size');
				if (parseInt(show_st) === 1) {
					obj.find(inputClass).css('border-radius', size + 'px');
				} else {
					obj.find(inputClass).removeCss('border-radius');
				}
			};
			arguments.callee.previewform_elementBorderRadius = function (obj, section) {
				var show_st = this.getUiData3('skin', 'form_border_radius', 'show_st');
				var size = this.getUiData3('skin', 'form_border_radius', 'size');
				if (parseInt(show_st) === 1) {
					obj.find('.uiform-main-form').css('border-radius', size + 'px');
				} else {
					obj.find('.uiform-main-form').removeCss('border-radius');
				}
			};

			arguments.callee.previewfield_elementHelpBlockText = function (obj, section) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var show_st = this.getUiData5('steps_src', f_step, f_id, section, 'show_st');
				var text = this.getUiData5('steps_src', f_step, f_id, section, 'text');
				var font = this.getUiData5('steps_src', f_step, f_id, section, 'font');
				var font_st = this.getUiData5('steps_src', f_step, f_id, section, 'font_st');
				var block_pos = this.getUiData5('steps_src', f_step, f_id, section, 'pos');
				var block_input = obj.find('.uifm-input-container');
				var block_helpb = obj.find('.uifm-help-block');
				var blt = obj.find('.uifm-label-helpblock');

				if (parseInt(show_st) === 1) {
					switch (parseInt(block_pos)) {
						case 1:
							obj.find('.uifm-help-block').html(decodeURIComponent(text));
							break;
						case 2:
							if (blt.attr('data-original-title')) {
								blt.attr('data-original-title', decodeURIComponent(text));
								blt.tooltip('hide');
								blt.tooltip({
									animation: false,
									placement: blt.data('placement') || 'top',
									container: 'body',
									html: true,
									title: decodeURIComponent(text)
								});
								blt.tooltip('show');
							}

							break;
						case 3:
							if ($('#' + f_id + '_hb_modal')) {
								$('#' + f_id + '_hb_modal')
									.find('.sfdc-modal-body')
									.html(decodeURIComponent(text));
							}

							break;
						case 0:
						default:
							obj.find('.uifm-help-block').html(decodeURIComponent(text));
							break;
					}
				}
			};

			arguments.callee.previewfield_elementTextarea = function (obj, section) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var show_st = this.getUiData5('steps_src', f_step, f_id, section, 'show_st');
				var text = this.getUiData5('steps_src', f_step, f_id, section, 'text');
				var font = this.getUiData5('steps_src', f_step, f_id, section, 'font');
				var font_st = this.getUiData5('steps_src', f_step, f_id, section, 'font_st');
				if (parseInt(show_st) === 1) {
					this.previewfield_elementHelpBlockText(obj, section);

					if (parseInt(font_st) === 1 && font) {
						var font_sel = JSON.parse(font);
						obj.find('.uifm-help-block').css('font-family', font_sel.family);
					} else {
						obj.find('.uifm-help-block').removeCss('font-family');
					}
				} else {
					obj.find('.uifm-help-block').css('display', 'none');
					obj.find('.uifm-label-helpblock').hide();
				}
			};

			arguments.callee.previewfield_helpBlockPosition = function (obj, section) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var show_st = this.getUiData5('steps_src', f_step, f_id, section, 'show_st');
				var block_pos = this.getUiData5('steps_src', f_step, f_id, section, 'pos');
				var block_text = this.getUiData5('steps_src', f_step, f_id, section, 'text');
				var block_input = obj.find('.uifm-input-container');
				var block_helpb = obj.find('.uifm-help-block');
				var blt = obj.find('.uifm-label-helpblock');
				if (parseInt(show_st) === 1) {
					switch (parseInt(block_pos)) {
						case 1:
							if (blt.attr('data-original-title')) {
								if (blt.data && blt.data('tooltip')) {
								} else {
									blt.tooltip('hide');
									blt.tooltip('destroy');
								}
								blt.removeAttr('data-original-title');
							}
							if ($('#' + f_id + '_hb_modal')) {
								$('#' + f_id + '_hb_modal').remove();
							}

							blt.hide();
							block_helpb.show();
							$(block_helpb).insertBefore(block_input);
							break;
						case 2:
							if ($('#' + f_id + '_hb_modal')) {
								$('#' + f_id + '_hb_modal').remove();
							}

							if (blt.attr('data-original-title')) {
								if (blt.data && blt.data('tooltip')) {
								} else {
									blt.tooltip('hide');
									blt.tooltip('destroy');
								}
								blt.removeAttr('data-original-title');
							}

							blt.show();
							block_helpb.hide();

							blt.tooltip({
								animation: false,
								placement: blt.data('placement') || 'top',
								container: 'body',
								html: true,
								title: block_text
							});
							blt.attr('data-original-title', decodeURIComponent(block_text));
							if (String(this.getInnerVariable('setfield_tab_active')) === 'helpb') {
								blt.tooltip('show');
							}
							break;
						case 3:
							if (blt.attr('data-original-title')) {
								if (blt.data && blt.data('tooltip')) {
								} else {
									blt.tooltip('hide');
									blt.tooltip('destroy');
								}
								blt.removeAttr('data-original-title');
							}

							blt.show();
							block_helpb.hide();
							var modalhtml = $('#modaltemplate').clone();
							modalhtml.attr('id', f_id + '_hb_modal');
							modalhtml.find('.sfdc-modal-body').html(decodeURIComponent(block_text));
							$('body').append(modalhtml);
							blt.attr('data-target', '#' + f_id + '_hb_modal');
							blt.attr('data-toggle', 'modal');
							break;
						case 0:
						default:
							if (blt.attr('data-original-title')) {
								if (blt.data && blt.data('tooltip')) {
								} else {
									blt.tooltip('hide');
									blt.tooltip('destroy');
								}
								blt.removeAttr('data-original-title');
							}
							if ($('#' + f_id + '_hb_modal')) {
								$('#' + f_id + '_hb_modal').remove();
							}

							blt.hide();
							block_helpb.show();
							$(block_input).insertBefore(block_helpb);
							break;
					}
				} else {
					if (blt.attr('data-original-title')) {
						if (blt.data && blt.data('tooltip')) {
						} else {
							blt.tooltip('hide');
							blt.tooltip('destroy');
						}
						blt.removeAttr('data-original-title');
					}
					if ($('#' + f_id + '_hb_modal')) {
						$('#' + f_id + '_hb_modal').remove();
					}
					blt.hide();
					block_helpb.hide();
				}
			};

			arguments.callee.previewfield_validateRecIcon = function (obj, section) {
				var f_id = obj.attr('id'),
					f_step = $('#' + f_id)
						.closest('.uiform-step-pane')
						.data('uifm-step'),
					req_icon_st = this.getUiData5('steps_src', f_step, f_id, section, 'reqicon_st'),
					req_icon_pos = this.getUiData5('steps_src', f_step, f_id, section, 'reqicon_pos'),
					req_icon_img = this.getUiData5('steps_src', f_step, f_id, section, 'reqicon_img'),
					objlbl = obj.find('.uifm-label');
				if (parseInt(req_icon_st) === 1) {
					$('#' + f_id + '_val_iconreq_img').remove();
					if (parseInt(req_icon_pos) === 1) {
						objlbl.after('<i id="' + f_id + '_val_iconreq_img" class="glyphicon ' + req_icon_img + '"></i>');
					} else {
						objlbl.before('<i id="' + f_id + '_val_iconreq_img" class="glyphicon ' + req_icon_img + '"></i>');
					}
				} else {
					$('#' + f_id + '_val_iconreq_img').remove();
				}
			};
			arguments.callee.previewfield_hideAllPopOver = function () {
				var f_id = $('#uifm-field-selected-id').val();
				var obj = $('#' + f_id);
				if (obj) {
					var el = obj.find('.uifm-txtbox-inp-val');
					if (el.data && el.data('bs.popover')) {
						el.popover('destroy');
					}
				}
			};
			arguments.callee.previewfield_removeAllPopovers = function () {
				var tmp_popover = $('.uiform-main-form [aria-describedby^=popover]');
				if (tmp_popover) {
					$.each(tmp_popover, function (index, element) {
						if ($(element).data && $(element).data('bs.popover')) {
							$(element).popover('destroy');
						}
					});
				}
			};
			arguments.callee.previewfield_removeAllUndesiredObj = function (current) {
				var tmp_dtimes = $('.uiform-main-form .uiform-datepicker').not(current);
				var tmp_dtimes_others = tmp_dtimes.find('.bootstrap-datetimepicker-widget');
				if (tmp_dtimes_others) {
					tmp_dtimes_others.remove();
				}
			};
			arguments.callee.previewfield_hidePopOver = function () {
				var f_id = $('#uifm-field-selected-id').val();
				var obj = $('#' + f_id);
				if (obj) {
					var el = obj.find('.uifm-txtbox-inp-val');

					switch (String(this.getInnerVariable('setfield_tab_active'))) {
						case 'label':
						case 'input':
						case 'helpb':
							if (el.data && el.data('bs.popover')) {
								el.popover('destroy');
							}

							break;
						case 'validate':
							this.previewfield_validatePopover(obj, 'validate');
							break;
						default:
							break;
					}
				}
			};

			arguments.callee.previewfield_helpblock_hidetooltip = function () {
				var f_id = $('#uifm-field-selected-id').val();
				var obj = $('#' + f_id);
				if (obj) {
					var el = obj.find('.uifm-label-helpblock');

					switch (String(this.getInnerVariable('setfield_tab_active'))) {
						case 'helpb':
							break;
						default:
						case 'label':
						case 'input':
						case 'helpb':
							if (el.data && el.data('bs.tooltip')) {
								el.tooltip('destroy');
							}
							break;
					}
				}
			};

			arguments.callee.previewfield_validatePopover = function (obj, section) {
				var f_id = obj.attr('id'),
					f_step = $('#' + f_id)
						.closest('.uiform-step-pane')
						.data('uifm-step'),
					f_type = this.getUiData4('steps_src', f_step, f_id, 'type'),
					typ_val = this.getUiData5('steps_src', f_step, f_id, section, 'typ_val'),
					typ_val_custxt = this.getUiData5('steps_src', f_step, f_id, section, 'typ_val_custxt'),
					pos = this.getUiData5('steps_src', f_step, f_id, section, 'pos'),
					tip_col = this.getUiData5('steps_src', f_step, f_id, section, 'tip_col'),
					tip_bg = this.getUiData5('steps_src', f_step, f_id, section, 'tip_bg');

				var el;
				switch (parseInt(f_type)) {
					case 6:
					case 7:
						el = obj.find('.uifm-txtbox-inp-val');
						break;
					case 8:
					case 9:
					case 10:
					case 11:
						el = obj.find('.uifm-input2-wrap');
						break;
					case 12:
						el = obj.find('.uifm-fileinput-wrap');
						break;
					case 13:

						el = obj.find('.uifm-fileinput-wrap .fileinput-preview');
						break;
					case 15:
						el = obj.find('.uifm-txtbox-inp-val');
						break;
					case 19:
						el = obj.find('.uifm-inp6-captcha-inputcode');
						break;
					case 23:
						el = obj.find('.uiform-colorpicker-wrap');
						break;
					case 24:
						el = obj.find('.uifm-input7-datepic');
						break;
					case 25:
						el = obj.find('.uifm-input7-timepic');
						break;
					case 26:
						el = obj.find('.uifm-input7-datetimepic');
						break;
					case 27:
						el = obj.find('.uifm-input-recaptcha');
						break;
					case 28:
					case 29:
					case 30:

						el = obj.find('.uifm-txtbox-inp-val');
						break;
					case 43:
						return;
						break;
					default:
						return;
						break;
				}

				var showPopover = function () {
						el.popover('show');
					},
					hidePopover = function () {
						el.popover('hide');
					};
				var custom_txt, default_txt, content_txt;
				switch (parseInt(typ_val)) {
					case 1:
						default_txt = $('#uifm-custom-val-alpha-deftxt').val();
						custom_txt = typ_val_custxt;
						if (custom_txt) {
							content_txt = custom_txt;
						} else {
							content_txt = default_txt;
						}
						break;
					case 2:
						default_txt = $('#uifm-custom-val-alphanum-deftxt').val();
						custom_txt = typ_val_custxt;
						if (custom_txt) {
							content_txt = custom_txt;
						} else {
							content_txt = default_txt;
						}
						break;
					case 3:
						default_txt = $('#uifm-custom-val-numbers-deftxt').val();
						custom_txt = typ_val_custxt;
						if (custom_txt) {
							content_txt = custom_txt;
						} else {
							content_txt = default_txt;
						}
						break;
					case 4:
						default_txt = $('#uifm-custom-val-email-deftxt').val();
						custom_txt = typ_val_custxt;
						if (custom_txt) {
							content_txt = custom_txt;
						} else {
							content_txt = default_txt;
						}
						break;
					case 5:

						default_txt = $('#uifm-custom-val-req-deftxt').val();
						custom_txt = typ_val_custxt;
						if (custom_txt) {
							content_txt = custom_txt;
						} else {
							content_txt = default_txt;
						}
						break;
					default:
						break;
				}

				var cus_placement;
				switch (parseInt(pos)) {
					case 1:
						cus_placement = 'right';
						break;
					case 2:
						cus_placement = 'bottom';
						break;
					case 3:
						cus_placement = 'left';
						break;
					case 0:
					default:
						cus_placement = 'top';
						break;
				}

				switch (parseInt(typ_val)) {
					case 6:
						$('#zgfm-field-val-custominput-box').show();
						break;
					default:
						$('#zgfm-field-val-custominput-box').hide();
						break;
				}

				switch (parseInt(typ_val)) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:

						var id_popover;
						if (el.data && el.data('bs.popover')) {
							el.popover('destroy');
						}
						el.popover({
							placement: cus_placement,
							content: content_txt,
							trigger: 'manual',
							animation: false,
							container: 'body',
							html: true
						})
							.focus(showPopover)
							.blur(hidePopover);

						if (String(this.getInnerVariable('setfield_tab_active')) === 'validate') {
							el.popover('show');
						}

						id_popover = el.attr('aria-describedby');
						var border_focus_str = '';
						if ($('#' + f_id)) {
							$('#' + f_id + '_val_ppbox').remove();
							border_focus_str = '<style type="text/css" id="' + f_id + '_val_ppbox">';
							border_focus_str += '#' + id_popover + '.sfdc-popover {';
							border_focus_str += 'background:' + tip_bg + '!important;';
							border_focus_str += 'color:' + tip_col + ';';
							border_focus_str += '} ';
							border_focus_str += '#' + id_popover + '.sfdc-popover .sfdc-popover-arrow:after,';
							border_focus_str += '#' + id_popover + '.sfdc-popover.sfdc-top > .sfdc-arrow::after{';
							switch (parseInt(pos)) {
								case 1:
									border_focus_str += 'border-right-color:' + tip_bg + '!important;';
									break;
								case 2:
									border_focus_str += 'border-bottom-color:' + tip_bg + '!important;';
									break;
								case 3:
									border_focus_str += 'border-left-color:' + tip_bg + '!important;';
									break;
								case 0:
								default:
									border_focus_str += 'border-top-color:' + tip_bg + '!important;';
									break;
							}
							border_focus_str += '} ';
							border_focus_str += '</style>';
							$('head').append(border_focus_str);
						}
						$('#uifm-custom-val-title-added').show();
						break;
					default:
						$('#uifm-custom-val-title-added').hide();
						if (el.data && el.data('bs.popover')) {
							el.popover('destroy');
						}
						break;
				}
			};
			arguments.callee.previewfield_elementBorder = function (obj, section, inputClass) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var show_st = this.getUiData5('steps_src', f_step, f_id, section, 'show_st');
				var color = this.getUiData5('steps_src', f_step, f_id, section, 'color');
				var color_focus_st = this.getUiData5('steps_src', f_step, f_id, section, 'color_focus_st');
				var color_focus = this.getUiData5('steps_src', f_step, f_id, section, 'color_focus');
				var style = this.getUiData5('steps_src', f_step, f_id, section, 'style');
				var width = this.getUiData5('steps_src', f_step, f_id, section, 'width');
				var border_sty;
				var border_focus_str;
				if (parseInt(show_st) === 1) {
					if (parseInt(style) === 1) {
						border_sty = 'solid ';
					} else {
						border_sty = 'dotted ';
					}
					border_sty += color + ' ' + width + 'px';
					obj.find(inputClass).css('border', border_sty);
				} else {
					obj.find(inputClass).removeCss('border');
				}
			};
			arguments.callee.previewform_elementBorder = function (obj, section) {
				var show_st = this.getUiData3('skin', 'form_border', 'show_st');
				var color = this.getUiData3('skin', 'form_border', 'color');
				var style = this.getUiData3('skin', 'form_border', 'style');
				var width = this.getUiData3('skin', 'form_border', 'width');
				var border_sty;
				if (parseInt(show_st) === 1) {
					if (parseInt(style) === 1) {
						border_sty = 'solid ';
					} else {
						border_sty = 'dotted ';
					}
					border_sty += color + ' ' + width + 'px';
					obj.find('.uiform-main-form').css('border', border_sty);
				} else {
					obj.find('.uiform-main-form').removeCss('border');
				}
			};
			arguments.callee.previewfield_elementBackground = function (obj, section, inputClass) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var show_st = this.getUiData5('steps_src', f_step, f_id, section, 'show_st');
				var type = this.getUiData5('steps_src', f_step, f_id, section, 'type');
				var start_color = this.getUiData5('steps_src', f_step, f_id, section, 'start_color');
				var end_color = this.getUiData5('steps_src', f_step, f_id, section, 'end_color');
				var solid_color = this.getUiData5('steps_src', f_step, f_id, section, 'solid_color');

				if (parseInt(show_st) === 1) {
					switch (parseInt(type)) {
						case 2:
							obj.find(inputClass).css({
								background: start_color,
								'background-image': '-webkit-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
								'background-image': '-moz-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
								'background-image': '-ms-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
								'background-image': '-o-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
								'background-image': 'linear-gradient(to bottom, ' + start_color + ',' + end_color + ')'
							});
							break;
						case 1:
						default:
							if (solid_color) {
								obj.find(inputClass).css('background', solid_color);
							}
							break;
					}
				} else {
					obj.find(inputClass).removeCss('background');
					obj.find(inputClass).removeCss('background-image');
				}
			};
			arguments.callee.previewform_elementPadding = function (obj, section) {
				var show_st = this.getUiData3('skin', 'form_padding', 'show_st');
				var pos_top = this.getUiData3('skin', 'form_padding', 'pos_top');
				var pos_right = this.getUiData3('skin', 'form_padding', 'pos_right');
				var pos_bottom = this.getUiData3('skin', 'form_padding', 'pos_bottom');
				var pos_left = this.getUiData3('skin', 'form_padding', 'pos_left');
				if (parseInt(show_st) === 1) {
					var pad_tmp = pos_top + 'px ' + pos_right + 'px ' + pos_bottom + 'px ' + pos_left + 'px';
					obj.find('.uiform-main-form').css('padding', pad_tmp);
				} else {
					obj.find('.uiform-main-form').removeCss('padding');
				}
			};
			arguments.callee.previewform_elementBackground = function (obj, section) {
				var show_st = this.getUiData3('skin', 'form_background', 'show_st');
				var type = this.getUiData3('skin', 'form_background', 'type');
				var start_color = this.getUiData3('skin', 'form_background', 'start_color');
				var end_color = this.getUiData3('skin', 'form_background', 'end_color');
				var solid_color = this.getUiData3('skin', 'form_background', 'solid_color');
				var skin_bg_imgurl = this.getUiData3('skin', 'form_background', 'image');

				if (parseInt(show_st) === 1) {
					switch (parseInt(type)) {
						case 2:
							obj.find('.uiform-main-form').css({
								background: start_color,
								'background-image': '-webkit-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
								'background-image': '-moz-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
								'background-image': '-ms-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
								'background-image': '-o-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
								'background-image': 'linear-gradient(to bottom, ' + start_color + ',' + end_color + ')'
							});
							if ($('.uiform-main-form').find('.uiform-divider-text')) {
								$('.uiform-main-form')
									.find('.uiform-divider-text')
									.css({
										background: start_color,
										'background-image': '-webkit-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
										'background-image': '-moz-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
										'background-image': '-ms-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
										'background-image': '-o-linear-gradient(top, ' + start_color + ', ' + end_color + ')',
										'background-image': 'linear-gradient(to bottom, ' + start_color + ',' + end_color + ')'
									});
							}
							break;
						case 1:
						default:
							if (solid_color) {
								obj.find('.uiform-main-form').css('background', solid_color);
							}
							if ($('.uiform-main-form').find('.uiform-divider-text')) {
								$('.uiform-main-form').find('.uiform-divider-text').css('background', solid_color);
							}

							break;
					}
					if (skin_bg_imgurl) {
						obj.find('.uiform-main-form').removeCss('background-image');
						obj.find('.uiform-main-form').css({
							'background-image': "url('" + skin_bg_imgurl + "')",
							'background-repeat': 'repeat'
						});
						if ($('.uiform-main-form').find('.uiform-divider-text')) {
							$('.uiform-main-form')
								.find('.uiform-divider-text')
								.css({
									'background-image': "url('" + skin_bg_imgurl + "')",
									'background-repeat': 'repeat'
								});
						}
					} else {
					}
				} else {
					obj.find('.uiform-main-form').removeCss('background');
					obj.find('.uiform-main-form').removeCss('background-image');
					if ($('.uiform-main-form').find('.uiform-divider-text')) {
						$('.uiform-main-form').find('.uiform-divider-text').removeCss('background');
						$('.uiform-main-form').find('.uiform-divider-text').removeCss('background-image');
						$('.uiform-main-form').find('.uiform-divider-text').removeCss('background-repeat');
					}
				}
			};

			arguments.callee.previewfield_controlBlockLabel = function (obj, section) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var block_pos = this.getUiData5('steps_src', f_step, f_id, section, 'block_pos');
				var block_st = this.getUiData5('steps_src', f_step, f_id, section, 'block_st');
				var block_align = this.getUiData5('steps_src', f_step, f_id, section, 'block_align');
				var grid_layout = this.getUiData5('steps_src', f_step, f_id, section, 'grid_layout');
				var col_block = obj.find('.uifm-control-label').parent();
				var col_input = obj.find('.uifm-control-label').parent().siblings();
				var col_block_pos = parseInt(col_block.index());
				let tmp_pos;
				if (parseInt(block_st) === 1) {
					col_block.show();

					switch (parseInt(block_pos)) {
						case 1:
							if (col_block_pos === 1) {
								$(col_block).insertBefore(col_input);
							}
							obj.find('.uifm-control-label').parent().attr('class', 'rkfm-col-sm-12');
							obj.find('.uifm-control-label').parent().siblings().attr('class', 'rkfm-col-sm-12');
							break;
						case 2:
							if (col_block_pos === 0) {
								$(col_input).insertBefore(col_block);
							}

							tmp_pos = this.previewfield_getBlockGridLayout(grid_layout);

							obj.find('.uifm-control-label').parent().attr('class', `rkfm-col-sm-${tmp_pos['right']}`);
							obj.find('.uifm-control-label').parent().siblings().attr('class', `rkfm-col-sm-${tmp_pos['left']}`);

							break;
						case 3:
							if (col_block_pos === 0) {
								$(col_input).insertBefore(col_block);
							}
							obj.find('.uifm-control-label').parent().attr('class', 'rkfm-col-sm-12');
							obj.find('.uifm-control-label').parent().siblings().attr('class', 'rkfm-col-sm-12');
							break;
						case 0:
						default:
							if (col_block_pos === 1) {
								$(col_block).insertBefore(col_input);
							}
							tmp_pos = this.previewfield_getBlockGridLayout(grid_layout);

							obj.find('.uifm-control-label').parent().attr('class', `rkfm-col-sm-${tmp_pos['left']}`);
							obj.find('.uifm-control-label').parent().siblings().attr('class', `rkfm-col-sm-${tmp_pos['right']}`);
							break;
					}

					switch (parseInt(block_align)) {
						case 1:
							obj.find('.uifm-control-label').css('text-align', 'center');
							break;
						case 2:
							obj.find('.uifm-control-label').css('text-align', 'right');
							break;
						case 0:
						default:
							obj.find('.uifm-control-label').css('text-align', 'left');
							break;
					}
				} else {
					col_block.hide();
					col_input.attr('class', 'rkfm-col-sm-12');
				}
			};

			arguments.callee.previewfield_getBlockGridLayout = function (pos) {
				var output = {};
				switch (parseInt(pos)) {
					case 1:
						output['left'] = 1;
						output['right'] = 10;
						break;
					case 2:
						output['left'] = 2;
						output['right'] = 9;
						break;
					case 3:
						output['left'] = 3;
						output['right'] = 9;
						break;
					case 4:
						output['left'] = 4;
						output['right'] = 8;
						break;
					case 5:
						output['left'] = 5;
						output['right'] = 7;
						break;
					case 6:
						output['left'] = 6;
						output['right'] = 6;
						break;
					case 7:
						output['left'] = 7;
						output['right'] = 5;
						break;
					case 8:
						output['left'] = 8;
						output['right'] = 4;
						break;
					case 9:
						output['left'] = 9;
						output['right'] = 3;
						break;
					case 10:
						output['left'] = 10;
						output['right'] = 2;
						break;
					case 11:
						output['left'] = 11;
						output['right'] = 1;
						break;
					default:
						break;
				}

				return output;
			};
			arguments.callee.previewfield_fontfamily = function (obj, section, container) {
				var f_st, f_font;
				var tmp_font_id;
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				f_st = this.getUiData5('steps_src', f_step, f_id, section, 'font_st');
				f_font = this.getUiData5('steps_src', f_step, f_id, section, 'font');

				if (parseInt(f_st) === 1 && f_font) {
					var font_sel = JSON.parse(f_font);
					obj.find(container).css('font-family', font_sel.family);
					if (undefined !== font_sel.import_family) {
						var atImport = '@import url(//fonts.googleapis.com/css?family=' + font_sel.import_family;
						tmp_font_id = 'zgfm_font_' + String(font_sel.import_family).cleanup();
						if (parseInt($('#' + tmp_font_id).length) === 0) {
							$('<style type="text/css" id="' + tmp_font_id + '">')
								.append(atImport)
								.appendTo('head');
						}
					}
				} else {
					obj.find(container).removeCss('font-family');
				}
			};

			arguments.callee.previewfield_fontfamily2 = function (obj, section) {
				var f_st, f_font;
				var tmp_font_id;
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				f_st = this.getUiData5('steps_src', f_step, f_id, section, 'font_st');
				f_font = this.getUiData5('steps_src', f_step, f_id, section, 'font');

				if (parseInt(f_st) === 1 && f_font) {
					var font_sel = JSON.parse(f_font);
					if (undefined !== font_sel.import_family) {
						var atImport = '@import url(//fonts.googleapis.com/css?family=' + font_sel.import_family;
						tmp_font_id = 'zgfm_font_' + String(font_sel.import_family).cleanup();

						if (parseInt($('#' + tmp_font_id).length) === 0) {
							$('<style type="text/css" id="' + tmp_font_id + '">')
								.append(atImport)
								.appendTo('head');
						}
					}
				}
			};
			arguments.callee.setDataOptToPrevForm = function (obj, section, f_store, value) {
				var section2, option, option2, tmp_store;

				tmp_store = f_store.split('-');
				section2 = tmp_store[0];
				option = tmp_store[1];
				option2 = tmp_store[2] || null;

				switch (String(section)) {
					case 'main':
						switch (String(section2)) {
							case 'submit_ajax':
								break;
							case 'add_css':
								break;
							case 'add_js':
								break;
							case 'onload_scroll':
								break;
							case 'preload_noconflict':
								break;
							case 'pdf_charset':
								break;
							case 'pdf_font':
								break;
						}
						break;
					case 'wizard':
						switch (String(section2)) {
							case 'enable_st':
								break;
							case 'tabs':
								break;
							case 'theme_type':
								break;
							case 'theme':
								switch (parseInt(option)) {
									case 0:
										switch (String(option2)) {
											case 'skin_tab_cur_bgcolor':
												break;
											case 'skin_tab_cur_txtcolor':
												break;
											case 'skin_tab_cur_numtxtcolor':
												break;
											case 'skin_tab_inac_bgcolor':
												break;
											case 'skin_tab_inac_txtcolor':
												break;
											case 'skin_tab_inac_numtxtcolor':
												break;
											case 'skin_tab_done_bgcolor':
												break;
											case 'skin_tab_done_txtcolor':
												break;
											case 'skin_tab_done_numtxtcolor':
												break;
											case 'skin_tab_cont_bgcolor':
												break;
											case 'skin_tab_cont_borcol':
												break;
										}
										break;
									case 1:
										switch (String(option2)) {
											case 'skin_tab_cur_bgcolor':
												break;
											case 'skin_tab_cur_txtcolor':
												break;
											case 'skin_tab_cur_numtxtcolor':
												break;
											case 'skin_tab_cur_bg_numtxt':
												break;
											case 'skin_tab_inac_bgcolor':
												break;
											case 'skin_tab_inac_txtcolor':
												break;
										}
										break;
								}
								break;
						}
						break;
					case 'onsubm':
						switch (String(section2)) {
							case 'sm_successtext':
								break;
							case 'sm_boxmsg_bg_st':
								break;
							case 'sm_boxmsg_bg_type':
								break;
							case 'sm_boxmsg_bg_solid':
								break;
							case 'sm_boxmsg_bg_start':
								break;
							case 'sm_boxmsg_bg_end':
								break;
							case 'sm_redirect_st':
								break;
							case 'sm_redirect_url':
								break;
							case 'mail_from_email':
								break;
							case 'mail_from_name':
								break;
							case 'mail_template_msg':
								break;
							case 'mail_recipient':
								break;
							case 'mail_cc':
								break;
							case 'mail_bcc':
								break;
							case 'mail_subject':
								break;
							case 'mail_usr_st':
								break;
							case 'mail_usr_template_msg':
								break;
							case 'mail_usr_pdf_st':
								break;
							case 'mail_usr_pdf_store':
								break;
							case 'mail_usr_pdf_st':
								break;
							case 'mail_usr_pdf_template_msg':
								break;
							case 'mail_usr_pdf_fn':
								break;
							case 'mail_usr_recipient':
								break;
							case 'mail_usr_recipient_name':
								break;
							case 'mail_usr_cc':
								break;
							case 'mail_usr_bcc':
								break;
							case 'mail_usr_subject':
								break;
						}
						break;
					case 'skin':
						switch (String(section2)) {
							case 'form_shadow':
								switch (String(option)) {
									case 'show_st':
									case 'color':
									case 'h_shadow':
									case 'h_shadow':
									case 'blur':
										this.previewform_shadowBox(obj);
										break;
									default:
								}
								break;
							case 'form_width':
								switch (String(option)) {
									case 'show_st':
									case 'max':
										this.previewform_skin_maxwidth();
										$(window).trigger('resize');
										break;
									default:
								}
								break;
							case 'form_padding':
								switch (String(option)) {
									case 'show_st':
									case 'pos_top':
									case 'pos_right':
									case 'pos_bottom':
									case 'pos_left':
										this.previewform_elementPadding(obj, section);
										$(window).trigger('resize');
										break;
									default:
								}
								break;

							case 'form_background':
								switch (String(option)) {
									case 'show_st':
									case 'type':
									case 'start_color':
									case 'end_color':
									case 'solid_color':
									case 'image':
										this.previewform_elementBackground(obj, section);
										break;
									default:
								}
								break;
							case 'form_border_radius':
								switch (String(option)) {
									case 'show_st':
									case 'size':
										this.previewform_elementBorderRadius(obj, section);
										break;
									default:
								}
								break;
							case 'form_border':
								switch (String(option)) {
									case 'show_st':
									case 'color':
									case 'color_focus_st':
									case 'color_focus':
									case 'style':
									case 'width':
										this.previewform_elementBorder(obj, section);
										break;
									default:
								}
								break;
						}

						break;
				}
			};

			arguments.callee.previewform_skin_maxwidth = function () {
				var maxwidth_st = this.getUiData3('skin', 'form_width', 'show_st');
				var maxwidth = this.getUiData3('skin', 'form_width', 'max');
				if (parseInt(maxwidth_st) === 1) {
					$('.uiform-main-form').css('max-width', maxwidth + 'px');
				} else {
					$('.uiform-main-form').removeCss('max-width');
				}
			};
			arguments.callee.setDataOptToPrevField = function (obj, f_store, value) {
				try {
					var id = obj.attr('id');
					var step = $('#' + id)
						.closest('.uiform-step-pane')
						.data('uifm-step');
					var type = this.getUiData4('steps_src', String(step), String(id), 'type');
					var section, option, opt1, opt2, tmp_store;

					tmp_store = f_store.split('-');
					section = tmp_store[0];
					option = tmp_store[1];

					switch (parseInt(type)) {
						case 31:
							opt2 = tmp_store[2] || null;
							break;
						default:
							opt2 = tmp_store[2] || null;
					}

					var inputClass;
					switch (String(section)) {
						case 'input':
						case 'input12':
						case 'input13':
							switch (String(section)) {
								case 'input':
									inputClass = '.uifm-txtbox-inp-val';
									break;
								case 'input12':
									inputClass = '.uifm-txtbox-inp12-val';
									break;
								case 'input13':
									inputClass = '.uifm-txtbox-inp13-val';
									break;
							}
							switch (String(option)) {
								case 'value_lbl':
									obj.find(inputClass).find('.uifm-inp-lbl').html(value);
									break;
								case 'value':
									var tmp_val = obj.find(inputClass).get(0) || null;
									if (tmp_val) {
										var type_el = tmp_val.tagName.toLowerCase();
										switch (type_el) {
											case 'h1':
											case 'h2':
											case 'h3':
											case 'h4':
											case 'h5':
											case 'h6':
												obj.find(inputClass).html(value);
												break;
											default:
												obj.find(inputClass).val(value);
												break;
										}
									}
									break;
								case 'size':
									obj.find(inputClass).css('font-size', value + 'px');
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										obj.find(inputClass).css('font-weight', 'bold');
									} else {
										obj.find(inputClass).css('font-weight', 'normal');
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										obj.find(inputClass).css('font-style', 'italic');
									} else {
										obj.find(inputClass).removeCss('font-style');
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										obj.find(inputClass).css('text-decoration', 'underline');
									} else {
										obj.find(inputClass).removeCss('text-decoration');
									}
									break;
								case 'placeholder':
									obj.find(inputClass).attr('placeholder', value);
									break;
								case 'color':
									obj.find(inputClass).removeCss('color');
									if (value) {
										obj.find(inputClass).css('color', value);
									}
									break;
								case 'font':
								case 'font_st':
									this.previewfield_fontfamily(obj, section, inputClass);
									break;
								case 'val_align':
									switch (parseInt(value)) {
										case 1:
											obj.find(inputClass).css('text-align', 'center');
											break;
										case 2:
											obj.find(inputClass).css('text-align', 'right');
											break;
										case 0:
										default:
											obj.find(inputClass).css('text-align', 'left');
											break;
									}

									break;
								case 'obj_align':
									switch (parseInt(value)) {
										case 1:
											obj.find(inputClass).parent().css('text-align', 'center');

											break;
										case 2:
											obj.find(inputClass).parent().css('text-align', 'right');

											break;
										case 0:
										default:
											obj.find(inputClass).parent().css('text-align', 'left');

											break;
									}
									break;
								case 'prepe_txt':
								case 'append_txt':
									this.previewfield_prepappTxtOnInput(obj, option);
									break;
								default:
							}
							break;
						case 'input2':
							switch (String(option)) {
								case 'font':
								case 'font_st':
								case 'size':
								case 'bold':
								case 'italic':
								case 'underline':
								case 'color':
								case 'block_align':
								case 'options':
									switch (parseInt(type)) {
										case 8:
											$('#' + id)
												.data('uiform_radiobtn')
												.input2settings_preview_genAllOptions();
											break;
										case 9:
											$('#' + id)
												.data('uiform_checkbox')
												.input2settings_preview_genAllOptions();
											break;
										case 10:
											$('#' + id)
												.data('uiform_select')
												.input2settings_preview_genAllOptions();
											break;
										case 11:
											$('#' + id)
												.data('uiform_multiselect')
												.input2settings_preview_genAllOptions();
											break;
									}
									break;
								case 'style_type':
								case 'stl1':
									switch (String(opt2)) {
										case 'border_color':
										case 'bg_color':
										case 'icon_color':
										case 'icon_mark':
										case 'size':
										default:
											switch (parseInt(type)) {
												case 8:
													$('#' + id)
														.data('uiform_radiobtn')
														.previewfield_input2_stl1();
													break;
												case 9:
													$('#' + id)
														.data('uiform_checkbox')
														.previewfield_input2_stl1();
													break;
												case 10:
													$('#' + id)
														.data('uiform_select')
														.previewfield_input2_stl1();
													break;
												case 11:
													$('#' + id)
														.data('uiform_multiselect')
														.previewfield_input2_stl1();
													break;
											}
											break;
									}
									break;
								default:
							}
							break;
						case 'input3':
							switch (String(option)) {
								case 'text':
									obj.find('.uifm-input3-customhtml').html(decodeURIComponent(value));
									break;
								case 'size':
									obj.find('.uifm-input3-customhtml').css('font-size', value + 'px');
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										obj.find('.uifm-input3-customhtml').css('font-weight', 'bold');
									} else {
										obj.find('.uifm-input3-customhtml').css('font-weight', 'normal');
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										obj.find('.uifm-input3-customhtml').css('font-style', 'italic');
									} else {
										obj.find('.uifm-input3-customhtml').removeCss('font-style');
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										obj.find('.uifm-input3-customhtml').css('text-decoration', 'underline');
									} else {
										obj.find('.uifm-input3-customhtml').removeCss('text-decoration');
									}
									break;

								case 'color':
									obj.find('.uifm-input3-customhtml').removeCss('color');
									if (value) {
										obj.find('.uifm-input3-customhtml').css('color', value);
									}
									break;
								case 'font':
								case 'font_st':
									this.previewfield_fontfamily(obj, section, '.uifm-input3-customhtml');
									break;
								default:
							}
							break;
						case 'input4':
							switch (String(option)) {
								case 'set_min':
								case 'set_max':
								case 'set_default':
								case 'set_step':
								case 'set_range1':
								case 'set_range2':
								case 'skin_maxwidth_st':
								case 'skin_maxwidth':
									this.input4settings_generateField(obj, section);
									break;
							}
							break;
						case 'input5':
							switch (String(option)) {
								case 'g_key_public':
								case 'g_key_secret':
								case 'g_theme':
									this.input5settings_checkRecaptcha(obj, section, option);
									break;
							}
							break;
						case 'input6':
							switch (String(option)) {
								case 'txt_color_st':
								case 'txt_color':
								case 'background_st':
								case 'background_color':
								case 'distortion':
								case 'behind_lines_st':
								case 'behind_lines':
								case 'front_lines_st':
								case 'front_lines':
									this.input6settings_checkCaptcha(obj, section, option);
									break;
							}
							break;
						case 'input7':
							switch (String(option)) {
								case 'format':
								case 'language':
									this.input7settings_updateField(obj, section, option);
									break;
							}
							break;
						case 'input8':
							switch (String(option)) {
								case 'value':
									obj.find('.uifm-txtbox-inp8-val').val(value);
									break;
							}
							break;
						case 'input9':
							switch (String(option)) {
								case 'txt_star1':
								case 'txt_star2':
								case 'txt_star3':
								case 'txt_star4':
								case 'txt_star5':
								case 'txt_norate':
									this.input9settings_updateField(obj, section);
									break;
							}
							break;
						case 'input10':
							switch (String(option)) {
								case 'value':
									obj.find('.uiform-colorpicker-wrap').colorpicker();
									break;
							}
							break;
						case 'input11':
							switch (String(option)) {
								case 'size':
									obj.find('.uiform-divider-text').css('font-size', value + 'px');
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										obj.find('.uiform-divider-text').css('font-weight', 'bold');
									} else {
										obj.find('.uiform-divider-text').css('font-weight', 'normal');
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										obj.find('.uiform-divider-text').css('font-style', 'italic');
									} else {
										obj.find('.uiform-divider-text').removeCss('font-style');
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										obj.find('.uiform-divider-text').css('text-decoration', 'underline');
									} else {
										obj.find('.uiform-divider-text').removeCss('text-decoration');
									}
									break;
								case 'font_st':
								case 'font':
									this.previewfield_fontfamily(obj, section, '.uiform-divider-text');
									break;
								case 'div_color':
								case 'div_col_st':
								case 'text_color':
								case 'text_val':
									this.input11settings_updateField(obj, section, option);
									break;
							}
							break;
						case 'input14':
							switch (String(option)) {
								case 'obj_align':
									switch (parseInt(value)) {
										case 1:
											obj.find('.uifm-input-container').css('text-align', 'center');
											break;
										case 2:
											obj.find('.uifm-input-container').css('text-align', 'right');
											break;
										case 0:
										default:
											obj.find('.uifm-input-container').css('text-align', 'left');
											break;
									}
									break;
							}
							break;
						case 'input15':
							switch (String(option)) {
								case 'txt_yes':
									obj.find('.uifm-inp15-fld').bootstrapSwitchZgpb('onText', value);
									break;
								case 'txt_no':
									obj.find('.uifm-inp15-fld').bootstrapSwitchZgpb('offText', value);
									break;
							}
							break;
						case 'input17':
							switch (String(option)) {
								case 'thopt_mode':
								case 'thopt_height':
								case 'thopt_width':
								case 'options':
								case 'thopt_zoom':
								case 'thopt_usethmb':
								case 'thopt_showhvrtxt':
								case 'thopt_showcheckb':
									this.input17settings_preview_genAllOptions(obj, section);
									break;
							}
							break;
						case 'input18':
							this.input18settings_preview_genAllOptions(obj, section);
							break;
						case 'input_date2':
							$('#' + id)
								.data('uifm_datepickr_flat')
								.inputsettings_preview_genAllOptions(obj, section);
							break;
						case 'label':
							inputClass = '.uifm-label';

							switch (String(option)) {
								case 'text':
									obj.find(inputClass).html(value);
									break;
								case 'size':
									obj.find(inputClass).css('font-size', value + 'px');
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										obj.find(inputClass).css('font-weight', 'bold');
									} else {
										obj.find(inputClass).css('font-weight', 'normal');
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										obj.find(inputClass).css('font-style', 'italic');
									} else {
										obj.find(inputClass).removeCss('font-style');
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										obj.find(inputClass).css('text-decoration', 'underline');
									} else {
										obj.find(inputClass).removeCss('text-decoration');
									}
									break;
								case 'color':
									obj.find(inputClass).removeCss('color');
									if (value) {
										obj.find(inputClass).css('color', value);
									}
									break;
								case 'font':
								case 'font_st':
									this.previewfield_fontfamily(obj, section, inputClass);
									break;
								case 'shadow_st':
								case 'shadow_color':
								case 'shadow_x':
								case 'shadow_y':
								case 'shadow_blur':
									this.previewfield_shadowBox(obj, section, inputClass);
									break;
								default:
							}
							break;
						case 'sublabel':
							switch (String(option)) {
								case 'text':
									obj.find('.uifm-sublabel').html(value);
									break;
								case 'size':
									obj.find('.uifm-sublabel').css('font-size', value + 'px');
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										obj.find('.uifm-sublabel').css('font-weight', 'bold');
									} else {
										obj.find('.uifm-sublabel').css('font-weight', 'normal');
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										obj.find('.uifm-sublabel').css('font-style', 'italic');
									} else {
										obj.find('.uifm-sublabel').removeCss('font-style');
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										obj.find('.uifm-sublabel').css('text-decoration', 'underline');
									} else {
										obj.find('.uifm-sublabel').removeCss('text-decoration');
									}
									break;
								case 'color':
									obj.find('.uifm-sublabel').removeCss('color');
									if (value) {
										obj.find('.uifm-sublabel').css('color', value);
									}
									break;
								case 'font':
								case 'font_st':
									this.previewfield_fontfamily(obj, section, '.uifm-sublabel');
									break;
								case 'shadow_st':
								case 'shadow_color':
								case 'shadow_x':
								case 'shadow_y':
								case 'shadow_blur':
									this.previewfield_shadowBox(obj, section, '.uifm-sublabel');
									break;
								default:
							}
							break;
						case 'txt_block':
							switch (String(option)) {
								case 'block_pos':
								case 'block_st':
								case 'block_align':
								case 'grid_layout':
									this.previewfield_controlBlockLabel(obj, section);
									break;
								default:
							}
							break;
						case 'el_background':
						case 'el12_background':
						case 'el13_background':
							switch (String(section)) {
								case 'el_background':
									inputClass = '.uifm-txtbox-inp-val';
									break;
								case 'el12_background':
									inputClass = '.uifm-txtbox-inp12-val';
									break;
								case 'el13_background':
									inputClass = '.uifm-txtbox-inp13-val';
									break;
							}

							switch (String(option)) {
								case 'show_st':
								case 'type':
								case 'start_color':
								case 'end_color':
								case 'solid_color':
									this.previewfield_elementBackground(obj, section, inputClass);
									break;
								default:
							}
							break;
						case 'el_border_radius':
						case 'el12_border_radius':
						case 'el13_border_radius':
							switch (String(section)) {
								case 'el_border_radius':
									inputClass = '.uifm-txtbox-inp-val';
									break;
								case 'el12_border_radius':
									inputClass = '.uifm-txtbox-inp12-val';
									break;
								case 'el13_border_radius':
									inputClass = '.uifm-txtbox-inp13-val';
									break;
							}

							switch (String(option)) {
								case 'show_st':
								case 'size':
									this.previewfield_elementBorderRadius(obj, section, inputClass);
									break;
								default:
							}
							break;
						case 'el_border':
						case 'el12_border':
						case 'el13_border':
							switch (String(section)) {
								case 'el_border':
									inputClass = '.uifm-txtbox-inp-val';
									break;
								case 'el12_border':
									inputClass = '.uifm-txtbox-inp12-val';
									break;
								case 'el13_border':
									inputClass = '.uifm-txtbox-inp13-val';
									break;
							}

							switch (String(option)) {
								case 'show_st':
								case 'color':
								case 'color_focus_st':
								case 'color_focus':
								case 'style':
								case 'width':
									this.previewfield_elementBorder(obj, section, inputClass);
									break;
								default:
							}
							break;
						case 'help_block':
							switch (String(option)) {
								case 'text':

								case 'font':
									this.previewfield_elementTextarea(obj, section);
									break;
								case 'pos':
									this.previewfield_helpBlockPosition(obj, section);
									break;
								case 'show_st':
									this.previewfield_helpBlockPosition(obj, section);

									break;
								default:
							}
							break;
						case 'validate':

							switch (String(option)) {
								case 'typ_val':
									rocketform.fieldsdata_email_genListToIntMem();
								case 'typ_val_custxt':
								case 'pos':
								case 'tip_col':
								case 'tip_bg':
									this.previewfield_validatePopover(obj, section);

									break;
								case 'reqicon_st':
								case 'reqicon_pos':
								case 'reqicon_img':
									this.previewfield_validateRecIcon(obj, section);
									break;
								default:
							}
							break;
						case 'skin':
							switch (String(option)) {
								case 'margin':
									switch (String(opt2)) {
										case 'top':
											obj.css('margin-top', value + 'px');
											break;
										case 'bottom':
											obj.css('margin-bottom', value + 'px');

											break;
										case 'left':
											obj.css('margin-left', value + 'px');

											break;
										case 'right':
											obj.css('margin-right', value + 'px');

											break;
									}

									break;
								case 'padding':
									switch (String(opt2)) {
										case 'top':
											obj.css('padding-top', value + 'px');

											break;
										case 'bottom':
											obj.css('padding-bottom', value + 'px');

											break;
										case 'left':
											obj.css('padding-left', value + 'px');

											break;
										case 'right':
											obj.css('padding-right', value + 'px');

											break;
									}
									break;
							}
							break;
						default:
					}
				} catch (ex) {
					console.error('error setDataOptToPrevField obj.id : ' + obj.attr('id') + ' type: ' + obj.attr('data-typefield') + ' - store: ' + f_store + ' - value: ' + value + ' - error:' + ex.message);
				}
			};
			arguments.callee.setDataOptToSetTab_1 = function (tab, section, value, type) {
				switch (String(section)) {
					case 'field_name':
						switch (parseInt(type)) {
							case 6:
							case 7:
							case 8:
							case 9:
							case 10:
							case 11:
							case 12:
							case 13:
							case 15:
							case 16:
							case 17:
							case 18:
							case 21:

							case 22:
							case 23:

							case 24:

							case 25:

							case 26:

							case 28:
							case 29:

							case 30:
							case 40:
							case 41:
							case 42:
							case 43:

								if (value) {
									tab.find('#uifm_fld_main_fldname').val(value);
								}
								break;
						}
						break;
				}
			};
			arguments.callee.setDataOptToSetFormTab = function (tab, section, f_store, value) {
				var section2, option, option2, tmp_store;
				var editor, content;
				tmp_store = f_store.split('-');
				section2 = tmp_store[0];
				option = tmp_store[1];
				option2 = tmp_store[2] || null;

				switch (String(section)) {
					case 'main':
						switch (String(section2)) {
							case 'submit_ajax':
								var skin_main_ajaxst = parseInt(value) === 1 ? true : false;
								$('#uifm_frm_main_ajaxmode').bootstrapSwitchZgpb('state', skin_main_ajaxst);
								break;
							case 'add_css':
								if (value) {
									$('textarea#uifm_frm_main_addcss').val(decodeURIComponent(value));
								}

								var te_html;
								var field_obj_inp_html;

								te_html = document.getElementById('uifm_frm_main_addcss');
								field_obj_inp_html = CodeMirror.fromTextArea(te_html, {
									lineNumbers: true,
									lineWrapping: true,
									mode: 'css',
									keyMap: 'sublime',
									autoCloseBrackets: true,
									matchBrackets: true,
									showCursorWhenSelecting: true,
									theme: 'monokai',
									enableCodeFolding: true,
									enableCodeFormatting: true,
									highlightMatches: true,
									showCommentButton: true,

									showUncommentButton: true,
									styleActiveLine: true,
									tabSize: 2
								});
								field_obj_inp_html.foldCode(CodeMirror.Pos(0, 0));
								field_obj_inp_html.foldCode(CodeMirror.Pos(21, 0));
								field_obj_inp_html.setSize('100%', '100%');
								$('#uifm_frm_main_addcss').data('CodeMirrorInstance', field_obj_inp_html);

								break;
							case 'add_js':
								if (value) {
									$('textarea#uifm_frm_main_addjs').val(decodeURIComponent(value));
								}

								var te_html;
								var field_obj_inp_html;
								te_html = document.getElementById('uifm_frm_main_addjs');
								field_obj_inp_html = CodeMirror.fromTextArea(te_html, {
									lineNumbers: true,
									lineWrapping: true,
									mode: 'javascript',
									keyMap: 'sublime',
									autoCloseBrackets: true,
									matchBrackets: true,
									showCursorWhenSelecting: true,
									theme: 'monokai',
									enableCodeFolding: true,
									enableCodeFormatting: true,
									highlightMatches: true,
									showCommentButton: true,

									showUncommentButton: true,
									styleActiveLine: true,
									tabSize: 2
								});

								field_obj_inp_html.setSize('100%', '100%');
								$('#uifm_frm_main_addjs').data('CodeMirrorInstance', field_obj_inp_html);

								break;
							case 'onload_scroll':
								var main_onload_scroll = parseInt(value) === 1 ? true : false;
								if (main_onload_scroll) {
									$('#uifm_frm_main_onload_scroll').bootstrapSwitchZgpb('state', main_onload_scroll);
								}
								break;
							case 'preload_noconflict':
								var main_preload_noconflict = parseInt(value) === 1 ? true : false;
								if (main_preload_noconflict) {
									$('#uifm_frm_main_preload_noconflict').bootstrapSwitchZgpb('state', main_preload_noconflict);
								}
								break;
							case 'pdf_paper_size':
								$('#uifm_frm_main_pdf_papersize').val(value);
								break;
							case 'pdf_paper_orie':
								$('#uifm_frm_main_pdf_paperorien').val(value);
								break;
							case 'pdf_charset':
								var mail_usr_pdf_charset = value || 'UTF-8';
								$('#uifm_frm_email_usr_pdf_charset').val(mail_usr_pdf_charset);
								break;
							case 'pdf_font':
								var mail_usr_pdf_font = value;
								$('#uifm_frm_email_usr_tmpl_pdf_font').val(mail_usr_pdf_font);
								break;
							case 'email_html_fullpage':
								$('#uifm_frm_main_email_htmlfullpage').val(value);
								break;
							case 'email_dissubm':
								if ($('#uifm_frm_main_email_dissubm').length) {
									var email_dissubm = parseInt(this.getUiData2('main', 'email_dissubm')) === 1 ? true : false;
									$('#uifm_frm_main_email_dissubm').bootstrapSwitchZgpb('state', email_dissubm);
								}

								break;
							case 'pdf_html_fullpage':
								$('#uifm_frm_main_pdf_htmlfullpage').val(value);
								break;
						}
						break;
					case 'wizard':
						switch (String(section2)) {
							case 'enable_st':
								break;
							case 'tabs':
								break;
							case 'theme_type':
								break;
							case 'theme':
								switch (parseInt(option)) {
									case 0:
										switch (String(option2)) {
											case 'skin_tab_cur_bgcolor':
												break;
											case 'skin_tab_cur_txtcolor':
												break;
											case 'skin_tab_cur_numtxtcolor':
												break;
											case 'skin_tab_inac_bgcolor':
												break;
											case 'skin_tab_inac_txtcolor':
												break;
											case 'skin_tab_inac_numtxtcolor':
												break;
											case 'skin_tab_done_bgcolor':
												break;
											case 'skin_tab_done_txtcolor':
												break;
											case 'skin_tab_done_numtxtcolor':
												break;
											case 'skin_tab_cont_bgcolor':
												break;
											case 'skin_tab_cont_borcol':
												break;
										}
										break;
									case 1:
										switch (String(option2)) {
											case 'skin_tab_cur_bgcolor':
												break;
											case 'skin_tab_cur_txtcolor':
												break;
											case 'skin_tab_cur_numtxtcolor':
												break;
											case 'skin_tab_cur_bg_numtxt':
												break;
											case 'skin_tab_inac_bgcolor':
												break;
											case 'skin_tab_inac_txtcolor':
												break;
										}
										break;
								}
								break;
						}
						break;
					case 'onsubm':
						switch (String(section2)) {
							case 'sm_successtext':
								if (typeof tinymce != 'undefined') {
									editor = tinymce.get('uifm_frm_subm_msg');
									if (editor && editor instanceof tinymce.Editor) {
										content = decodeURIComponent(value);
										editor.setContent(content, { format: 'html' });
									} else {
										$('textarea#uifm_frm_subm_msg').val(decodeURIComponent(value));
									}
								}
								break;
							case 'sm_boxmsg_bg_st':
								var subm_bgst = parseInt(value) === 1 ? true : false;
								$('#uifm_frm_subm_bgst').bootstrapSwitchZgpb('state', subm_bgst);
								break;
							case 'sm_boxmsg_bg_type':
								var subm_bgtyp = value ? value : 1;
								if (parseInt(subm_bgtyp) === 1) {
									$('#uifm_frm_subm_bgst_typ1').addClass('sfdc-active');
									$('#uifm_frm_subm_bgst_typ2').removeClass('sfdc-active');
									$('#uifm_frm_subm_bgst_typ1').find('input').prop('checked', true);
									$('#uifm_frm_subm_bgst_typ1_handle').show();
									$('#uifm_frm_subm_bgst_typ2_handle').hide();
								} else {
									$('#uifm_frm_subm_bgst_typ2').addClass('sfdc-active');
									$('#uifm_frm_subm_bgst_typ1').removeClass('sfdc-active');
									$('#uifm_frm_subm_bgst_typ2').find('input').prop('checked', true);
									$('#uifm_frm_subm_bgst_typ1_handle').hide();
									$('#uifm_frm_subm_bgst_typ2_handle').show();
								}
								break;
							case 'sm_boxmsg_bg_solid':
								break;
							case 'sm_boxmsg_bg_start':
								break;
							case 'sm_boxmsg_bg_end':
								break;
							case 'sm_redirect_st':
								var subm_redirect_st = parseInt(value) === 1 ? true : false;
								$('#uifm_frm_subm_redirect_st').bootstrapSwitchZgpb('state', subm_redirect_st);
								break;
							case 'sm_redirect_url':
								$('#uifm_frm_subm_redirect_url').val(decodeURIComponent(value));
								break;
							case 'mail_from_email':
								if (value) {
									$('#uifm_frm_from_email').val(value);
								}
								break;
							case 'mail_from_name':
								if (value) {
									$('#uifm_frm_from_name').val(value);
								}
								break;
							case 'mail_template_msg':
								if (value) {
									if (typeof tinymce != 'undefined') {
										editor = tinymce.get('uifm_frm_email_tmpl');
										if (editor && editor instanceof tinymce.Editor) {
											content = decodeURIComponent(value);
											editor.setContent(content, { format: 'html' });
										} else {
											$('textarea#uifm_frm_email_tmpl').val(decodeURIComponent(value));
										}
									}
								}
								break;
							case 'mail_recipient':
								if (value) {
									$('#uifm_frm_email_recipient').val(value);
								}
								break;
							case 'mail_cc':
								if (value) {
									$('#uifm_frm_email_cc').val(value);
								}
								break;
							case 'mail_bcc':
								if (value) {
									$('#uifm_frm_email_bcc').val(value);
								}
								break;
							case 'mail_subject':
								if (value) {
									$('#uifm_frm_email_subject').val(value);
								}
								break;
							case 'mail_usr_st':
								var mail_usr_st = parseInt(value) === 1 ? true : false;
								$('#uifm_frm_email_usr_sendst').bootstrapSwitchZgpb('state', mail_usr_st);
								break;
							case 'mail_usr_template_msg':
								if (value) {
									if (typeof tinymce != 'undefined') {
										editor = tinymce.get('uifm_frm_email_usr_tmpl');
										if (editor && editor instanceof tinymce.Editor) {
											content = decodeURIComponent(value);
											editor.setContent(content, { format: 'html' });
										} else {
											$('textarea#uifm_frm_email_usr_tmpl').val(decodeURIComponent(value));
										}
									}
								}
								break;
							case 'mail_usr_pdf_st':
								var mail_usr_pdf_st = parseInt(value) === 1 ? true : false;
								$('#uifm_frm_email_usr_attachpdfst').bootstrapSwitchZgpb('state', mail_usr_pdf_st);

								break;
							case 'mail_usr_pdf_store':
								break;
							case 'mail_usr_pdf_st':
								break;
							case 'mail_usr_pdf_template_msg':
								if (value) {
									if (typeof tinymce != 'undefined') {
										editor = tinymce.get('uifm_frm_email_usr_tmpl_pdf');
										if (editor && editor instanceof tinymce.Editor) {
											content = decodeURIComponent(value);
											editor.setContent(content, { format: 'html' });
										} else {
											$('textarea#uifm_frm_email_usr_tmpl_pdf').val(decodeURIComponent(value));
										}
									}
								}
								break;
							case 'mail_usr_pdf_fn':
								var mail_usr_pdf_fn = decodeURIComponent(value);
								if (mail_usr_pdf_fn) {
									$('#uifm_frm_email_usr_tmpl_pdf_fn').val(mail_usr_pdf_fn);
								}
								break;
							case 'mail_usr_recipient':
								break;
							case 'mail_usr_recipient_name':
								break;
							case 'mail_usr_cc':
								var mail_usr_cc = value;
								if (mail_usr_cc) {
									$('#uifm_frm_email_usr_cc').val(mail_usr_cc);
								}
								break;
							case 'mail_usr_bcc':
								var mail_usr_bcc = value;
								if (mail_usr_bcc) {
									$('#uifm_frm_email_usr_bcc').val(mail_usr_bcc);
								}
								break;
							case 'mail_usr_subject':
								var mail_usr_subject = value;
								if (mail_usr_subject) {
									$('#uifm_frm_email_usr_subject').val(mail_usr_subject);
								}
								break;
						}
						break;
					case 'skin':
						switch (String(section2)) {
							case 'form_width':
								switch (String(option)) {
									case 'show_st':
										if (parseInt(value) === 1) {
											tab.find('#uifm_frm_skin_width_st').bootstrapSwitchZgpb('state', true);
										} else {
											tab.find('#uifm_frm_skin_width_st').bootstrapSwitchZgpb('state', false);
										}
										break;
									case 'max':
										tab.find('#uifm_frm_skin_maxwidth').val(value);
										break;
								}
								break;
							case 'form_padding':
								switch (String(option)) {
									case 'show_st':
										if (parseInt(value) === 1) {
											tab.find('#uifm_frm_skin_padd_st').bootstrapSwitchZgpb('state', true);
										} else {
											tab.find('#uifm_frm_skin_padd_st').bootstrapSwitchZgpb('state', false);
										}
										break;
									case 'pos_top':
										tab.find('#uifm_frm_skin_padd_top').val(value);
										break;
									case 'pos_right':
										tab.find('#uifm_frm_skin_padd_right').val(value);
										break;
									case 'pos_bottom':
										tab.find('#uifm_frm_skin_padd_bottom').val(value);
										break;
									case 'pos_left':
										tab.find('#uifm_frm_skin_padd_left').val(value);
										break;
								}
								break;
							case 'form_background':
								switch (String(option)) {
									case 'show_st':
										if (parseInt(value) === 1) {
											tab.find('#uifm_frm_skin_fmbg_st').bootstrapSwitchZgpb('state', true);
										} else {
											tab.find('#uifm_frm_skin_fmbg_st').bootstrapSwitchZgpb('state', false);
										}
										break;
									case 'type':
										switch (parseInt(value)) {
											case 2:
												tab.find('#uifm_frm_skin_fmbg_type_2').prop('checked', true);
												tab.find('#uifm_frm_skin_fmbg_type_2').addClass('sfdc-active');
												tab.find('#uifm_frm_skin_fmbg_type_opts1').hide();
												tab.find('#uifm_frm_skin_fmbg_type_opts2').show();

												break;
											case 1:
											default:
												tab.find('#uifm_frm_skin_fmbg_type_1').prop('checked', true);
												tab.find('#uifm_frm_skin_fmbg_type_1').addClass('sfdc-active');
												tab.find('#uifm_frm_skin_fmbg_type_opts1').show();
												tab.find('#uifm_frm_skin_fmbg_type_opts2').hide();
												break;
										}
										break;
									case 'start_color':
										tab.find('#uifm_frm_skin_fmbg_color_2').parent().colorpicker('setValue', value);
										tab.find('#uifm_frm_skin_fmbg_color_2').val(value);
										break;
									case 'end_color':
										tab.find('#uifm_frm_skin_fmbg_color_3').parent().colorpicker('setValue', value);
										tab.find('#uifm_frm_skin_fmbg_color_3').val(value);
										break;
									case 'solid_color':
										tab.find('#uifm_frm_skin_fmbg_color_1').parent().colorpicker('setValue', value);
										tab.find('#uifm_frm_skin_fmbg_color_1').val(value);
										break;
									case 'image':
										if (value) {
											$('#uifm_frm_skin_bg_imgurl').val(value);
											$('#uifm_frm_skin_bg_srcimg_wrap').html('<img class="sfdc-img-thumbnail" src="' + value + '">');
										} else {
											$('#uifm_frm_skin_bg_imgurl').val('');
											$('#uifm_frm_skin_bg_srcimg_wrap').html('');
										}
										break;
								}
								break;
							case 'form_border_radius':
								switch (String(option)) {
									case 'show_st':
										if (parseInt(value) === 1) {
											tab.find('#uifm_frm_skin_fmbora_st').bootstrapSwitchZgpb('state', true);
										} else {
											tab.find('#uifm_frm_skin_fmbora_st').bootstrapSwitchZgpb('state', false);
										}
										break;
									case 'size':
										tab.find('#uifm_frm_skin_fmbora_size').bootstrapSlider('setValue', parseInt(value));
										break;
								}
								break;
							case 'form_border':
								switch (String(option)) {
									case 'show_st':
										if (parseInt(value) === 1) {
											tab.find('#uifm_frm_skin_fmbor_st').bootstrapSwitchZgpb('state', true);
										} else {
											tab.find('#uifm_frm_skin_fmbor_st').bootstrapSwitchZgpb('state', false);
										}
										break;
									case 'color':
										tab.find('#uifm_frm_skin_fmbor_color').parent().colorpicker('setValue', value);
										tab.find('#uifm_frm_skin_fmbor_color').val(value);
										break;
									case 'style':
										switch (parseInt(value)) {
											case 2:
												tab.find('#uifm_frm_skin_fmbor_style_2').prop('checked', true);
												tab.find('#uifm_frm_skin_fmbor_style_2').addClass('sfdc-active');
												break;
											case 1:
											default:
												tab.find('#uifm_frm_skin_fmbor_style_1').prop('checked', true);
												tab.find('#uifm_frm_skin_fmbor_style_1').addClass('sfdc-active');
												break;
										}
										break;
									case 'width':
										tab.find('#uifm_frm_skin_fmbor_width').bootstrapSlider('setValue', parseInt(value));
										break;
								}
								break;
							case 'form_shadow':
								switch (String(option)) {
									case 'show_st':
										if (parseInt(value) === 1) {
											tab.find('#uifm_frm_skin_sha_st').bootstrapSwitchZgpb('state', true);
										} else {
											tab.find('#uifm_frm_skin_sha_st').bootstrapSwitchZgpb('state', false);
										}
										break;
									case 'color':
										tab.find('#uifm_frm_skin_sha_co').parent().colorpicker('setValue', value);
										tab.find('#uifm_frm_skin_sha_co').val(value);
										break;
									case 'h_shadow':
										tab.find('#uifm_frm_skin_sha_x').bootstrapSlider('setValue', parseInt(value));

										break;
									case 'v_shadow':
										tab.find('#uifm_frm_skin_sha_y').bootstrapSlider('setValue', parseInt(value));

										break;
									case 'blur':
										tab.find('#uifm_frm_skin_sha_blur').bootstrapSlider('setValue', parseInt(value));

										break;
								}
								break;
						}
						break;
				}
			};
			arguments.callee.setDataOptToSetTab = function (tab, f_store, value) {
				try {
					var id = $('#uifm-field-selected-id').val();
					var step = $('#' + id)
						.closest('.uiform-step-pane')
						.data('uifm-step');
					var type = this.getUiData4('steps_src', String(step), String(id), 'type');
					var section, option, opt1, opt2, tmp_store;
					switch (parseInt(type)) {
						case 31:
							tmp_store = f_store.split('-');
							section = tmp_store[0];
							option = tmp_store[1];
							opt2 = tmp_store[2] || '';
							break;
						default:
							tmp_store = f_store.split('-');
							section = tmp_store[0];
							option = tmp_store[1];
							opt2 = tmp_store[2] || null;
					}

					var prefix_ind;

					switch (String(section)) {
						case 'input':
						case 'input12':
						case 'input13':
							switch (String(section)) {
								case 'input':
									prefix_ind = '';
									break;
								case 'input12':
									prefix_ind = '12';
									break;
								case 'input13':
									prefix_ind = '13';
									break;
							}
							switch (String(option)) {
								case 'value_lbl':
									tab.find('#uifm_fld_input' + prefix_ind + '_value').val(value);
									break;
								case 'value_lbl_last':
									tab.find('#uifm_fld_input' + prefix_ind + '_value_lbl_last').val(value);
									break;
								case 'value':
									tab.find('#uifm_fld_input_value').val(value);
									break;
								case 'size':
									tab.find('#uifm_fld_inp' + prefix_ind + '_size').selectpicker('val', value);
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										tab
											.find('#uifm_fld_inp' + prefix_ind + '_bold')
											.parent()
											.addClass('sfdc-active');
										tab.find('#uifm_fld_inp' + prefix_ind + '_bold').val(1);
									} else {
										tab
											.find('#uifm_fld_inp' + prefix_ind + '_bold')
											.parent()
											.removeClass('sfdc-active');
										tab.find('#uifm_fld_inp' + prefix_ind + '_bold').val(0);
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										tab
											.find('#uifm_fld_inp' + prefix_ind + '_italic')
											.parent()
											.addClass('sfdc-active');
										tab.find('#uifm_fld_inp' + prefix_ind + '_italic').val(1);
									} else {
										tab
											.find('#uifm_fld_inp' + prefix_ind + '_italic')
											.parent()
											.removeClass('sfdc-active');
										tab.find('#uifm_fld_inp' + prefix_ind + '_italic').val(0);
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										tab
											.find('#uifm_fld_inp' + prefix_ind + '_u')
											.parent()
											.addClass('sfdc-active');
										tab.find('#uifm_fld_inp' + prefix_ind + '_u').val(1);
									} else {
										tab
											.find('#uifm_fld_inp' + prefix_ind + '_u')
											.parent()
											.removeClass('sfdc-active');
										tab.find('#uifm_fld_inp' + prefix_ind + '_u').val(0);
									}
									break;
								case 'placeholder':
									tab.find('#uifm_fld_inp' + prefix_ind + '_pholdr').val(value);
									break;
								case 'color':
									tab
										.find('#uifm_fld_inp' + prefix_ind + '_color')
										.parent()
										.colorpicker('setValue', value);
									tab.find('#uifm_fld_inp' + prefix_ind + '_color').val(value);
									break;
								case 'font':
									uiformUpdateFontSelect('uifm_fld_inp' + prefix_ind + '_font', value);
									break;
								case 'font_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp' + prefix_ind + '_font_st').prop('checked', true);
									} else {
										tab.find('#uifm_fld_inp' + prefix_ind + '_font_st').prop('checked', false);
									}
									break;
								case 'val_align':
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm_fld_inp' + prefix_ind + '_align_2').prop('checked', true);
											tab
												.find('#uifm_fld_inp' + prefix_ind + '_align_2')
												.parent()
												.addClass('sfdc-active');
											break;
										case 2:
											tab.find('#uifm_fld_inp' + prefix_ind + '_align_3').prop('checked', true);
											tab
												.find('#uifm_fld_inp' + prefix_ind + '_align_3')
												.parent()
												.addClass('sfdc-active');
											break;
										case 0:
										default:
											tab.find('#uifm_fld_inp' + prefix_ind + '_align_1').prop('checked', true);
											tab
												.find('#uifm_fld_inp' + prefix_ind + '_align_1')
												.parent()
												.addClass('sfdc-active');
											break;
									}
									break;
								case 'obj_align':
									tab
										.find('#uifm_fld_inp' + prefix_ind + '_objalign_2')
										.parent()
										.parent()
										.find('input')
										.prop('checked', false);
									tab
										.find('#uifm_fld_inp' + prefix_ind + '_objalign_2')
										.parent()
										.parent()
										.find('label')
										.removeClass('sfdc-active');
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm_fld_inp' + prefix_ind + '_objalign_2').prop('checked', true);
											tab
												.find('#uifm_fld_inp' + prefix_ind + '_objalign_2')
												.parent()
												.addClass('sfdc-active');
											break;
										case 2:
											tab.find('#uifm_fld_inp' + prefix_ind + '_objalign_3').prop('checked', true);
											tab
												.find('#uifm_fld_inp' + prefix_ind + '_objalign_3')
												.parent()
												.addClass('sfdc-active');
											break;
										case 0:
										default:
											tab.find('#uifm_fld_inp' + prefix_ind + '_objalign_1').prop('checked', true);
											tab
												.find('#uifm_fld_inp' + prefix_ind + '_objalign_1')
												.parent()
												.addClass('sfdc-active');
											break;
									}
									break;
								case 'prepe_txt':
									tab.find('#uifm_fld_input_prep_preview').html(decodeURIComponent(value));
									break;
								case 'append_txt':
									tab.find('#uifm_fld_input_appe_preview').html(decodeURIComponent(value));
									break;
								default:
							}
							break;
						case 'input2':
							switch (String(option)) {
								case 'size':
									tab.find('#uifm_fld_inp2_size').selectpicker('val', value);
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp2_bold').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_inp2_bold').val(1);
									} else {
										tab.find('#uifm_fld_inp2_bold').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_inp2_bold').val(0);
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp2_italic').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_inp2_italic').val(1);
									} else {
										tab.find('#uifm_fld_inp2_italic').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_inp2_italic').val(0);
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp2_u').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_inp2_u').val(1);
									} else {
										tab.find('#uifm_fld_inp2_u').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_inp2_u').val(0);
									}
									break;

								case 'color':
									tab.find('#uifm_fld_inp2_color').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_inp2_color').val(value);
									break;
								case 'font':
									uiformUpdateFontSelect('uifm_fld_inp2_font', value);
									break;
								case 'font_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp2_font_st').prop('checked', true);
									} else {
										tab.find('#uifm_fld_inp2_font_st').prop('checked', false);
									}
									break;
								case 'block_align':
									switch (parseInt(value)) {
										case 1:
											tab.find('input#uifm_fld_inp2_blo_align_2').prop('checked', true);
											tab.find('input#uifm_fld_inp2_blo_align_2').parent().addClass('sfdc-active');
											break;
										case 0:
										default:
											tab.find('input#uifm_fld_inp2_blo_align_1').prop('checked', true);
											tab.find('input#uifm_fld_inp2_blo_align_1').parent().addClass('sfdc-active');
											break;
									}
									break;
								case 'options':
									rocketform.input2settings_tabeditor_generateAllOptions(value);
									break;
								case 'style_type':
									tab.find('#uifm_fld_inp2_style_type').val(value);

									switch (parseInt(value)) {
										case 1:
											tab.find('.uifm-set-section-input2-stl1').show();
											break;
										default:
											tab.find('.uifm-set-section-input2-stl1').hide();
									}

									break;
								case 'stl1':
									switch (String(opt2)) {
										case 'border_color':
											tab.find('#uifm_fld_inp2_stl1_brdcolor').parent().colorpicker('setValue', value);
											tab.find('#uifm_fld_inp2_stl1_brdcolor').val(value);
											break;
										case 'bg_color':
											tab.find('#uifm_fld_inp2_stl1_bgcolor').parent().colorpicker('setValue', value);
											tab.find('#uifm_fld_inp2_stl1_bgcolor').val(value);
											break;
										case 'icon_color':
											tab.find('#uifm_fld_inp2_stl1_iconcolor').parent().colorpicker('setValue', value);
											tab.find('#uifm_fld_inp2_stl1_iconcolor').val(value);
											break;
										case 'icon_mark':
											tab.find('#uifm_fld_inp2_stl1_icmark').iconpicker('setIcon', value);
											break;
										case 'size':
											tab.find('#uifm_fld_inp2_stl1_size').val(parseFloat(value));

											break;
										case 'bg1_color1':
											tab.find('#uifm_fld_inp2_stl1_bg1_color1').parent().colorpicker('setValue', value);
											tab.find('#uifm_fld_inp2_stl1_bg1_color1').val(value);
											break;
										case 'bg1_color2':
											tab.find('#uifm_fld_inp2_stl1_bg1_color2').parent().colorpicker('setValue', value);
											tab.find('#uifm_fld_inp2_stl1_bg1_color2').val(value);
											break;
										case 'bg2_color1_h':
											tab.find('#uifm_fld_inp2_bg2_color1_h').parent().colorpicker('setValue', value);
											tab.find('#uifm_fld_inp2_bg2_color1_h').val(value);
											break;
										case 'bg2_color2_h':
											tab.find('#uifm_fld_inp2_stl1_bg2_color2_h').parent().colorpicker('setValue', value);
											tab.find('#uifm_fld_inp2_stl1_bg2_color2_h').val(value);
											break;
										case 'search_st':
											if (parseInt(value) === 1) {
												tab.find('#uifm_fld_inp2_stl1_search_st').bootstrapSwitchZgpb('state', true);
											} else {
												tab.find('#uifm_fld_inp2_stl1_search_st').bootstrapSwitchZgpb('state', false);
											}
											break;
										case 'txt_noselected':
											tab.find('#uifm_fld_inp2_stl1_txtnoselected').val(value);
											break;
										case 'txt_noresult':
											tab.find('#uifm_fld_inp2_stl1_txtnoresult').val(value);
											break;
										case 'txt_countsel':
											tab.find('#uifm_fld_inp2_stl1_txtcountsel').val(value);
											break;
									}

									break;
								default:
							}
							break;
						case 'input3':
							switch (String(option)) {
								case 'text':
									if (typeof tinymce != 'undefined') {
										var editor = tinymce.get('uifm_fld_inp3_html');
										if (editor && editor instanceof tinymce.Editor) {
											var content = decodeURIComponent(value);
											editor.setContent(content, { format: 'html' });
										} else {
											$('textarea#uifm_fld_inp3_html').val(decodeURIComponent(value));
										}
									} else {
									}
									break;
								case 'size':
									tab.find('#uifm_fld_inp2_size').selectpicker('val', value);
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp2_bold').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_inp2_bold').val(1);
									} else {
										tab.find('#uifm_fld_inp2_bold').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_inp2_bold').val(0);
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp2_italic').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_inp2_italic').val(1);
									} else {
										tab.find('#uifm_fld_inp2_italic').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_inp2_italic').val(0);
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp2_u').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_inp2_u').val(1);
									} else {
										tab.find('#uifm_fld_inp2_u').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_inp2_u').val(0);
									}
									break;

								case 'color':
									tab.find('#uifm_fld_inp2_color').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_inp2_color').val(value);
									break;
								case 'font':
									uiformUpdateFontSelect('uifm_fld_inp2_font', value);
									break;
								case 'font_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp2_font_st').prop('checked', true);
									} else {
										tab.find('#uifm_fld_inp2_font_st').prop('checked', false);
									}
									break;
								default:
							}
							break;
						case 'input4':
							switch (String(option)) {
								case 'set_min':
									tab.find('#uifm_fld_inp4_spinner_opt1').val(parseFloat(value));
									break;
								case 'set_max':
									tab.find('#uifm_fld_inp4_spinner_opt2').val(parseFloat(value));
									break;
								case 'set_default':
									tab.find('#uifm_fld_inp4_spinner_opt3').val(parseFloat(value));
									break;
								case 'set_step':
									tab.find('#uifm_fld_inp4_spinner_opt4').val(parseFloat(value));
									break;
								case 'set_decimal':
									tab.find('#uifm_fld_inp4_spinner_decimals').val(parseFloat(value));
									break;	
								case 'set_range1':
									tab.find('#uifm_fld_inp4_spinner_opt5').val(parseFloat(value));
									break;
								case 'set_range2':
									tab.find('#uifm_fld_inp4_spinner_opt6').val(parseFloat(value));
									break;
								case 'skin_maxwidth_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp4_spinner_skin_maxwith_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_inp4_spinner_skin_maxwith_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'skin_maxwidth':
									tab.find('#uifm_fld_inp4_spinner_skin_maxwith').val(parseFloat(value));
									break;
							}
							break;
						case 'input5':
							switch (String(option)) {
								case 'g_key_public':
									tab.find('#uifm_fld_inp5_kpublic').val(value);
									break;
								case 'g_key_secret':
									tab.find('#uifm_fld_inp5_ksecret').val(value);
									break;
								case 'g_theme':
									tab.find('#uifm_fld_inp5_theme_2').parent().children('label').removeClass('sfdc-active');
									tab.find('#uifm_fld_inp5_theme_2').parent().children('input').prop('checked', false);
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm_fld_inp5_theme_2').find('input').prop('checked', true);
											tab.find('#uifm_fld_inp5_theme_2').addClass('sfdc-active');
											break;
										default:
											tab.find('#uifm_fld_inp5_theme_1').addClass('sfdc-active');
											tab.find('#uifm_fld_inp5_theme_1').find('input').prop('checked', true);
											break;
									}
									break;
							}
							break;
						case 'input6':
							switch (String(option)) {
								case 'txt_color_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp6_txtcolor_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_inp6_txtcolor_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'txt_color':
									tab.find('#uifm_fld_inp6_txtcolor').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_inp6_txtcolor').val(value);
									break;
								case 'background_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp6_bgcolor_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_inp6_bgcolor_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'background_color':
									tab.find('#uifm_fld_inp6_bgcolor').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_inp6_bgcolor').val(value);
									break;
								case 'distortion':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp6_distortion_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_inp6_distortion_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'behind_lines_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp6_behlines_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_inp6_behlines_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'behind_lines':
									tab.find('#uifm_fld_inp6_behlines').val(parseFloat(value));
									break;
								case 'front_lines_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp6_frontlines_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_inp6_frontlines_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'front_lines':
									tab.find('#uifm_fld_inp6_frontlines').val(parseFloat(value));
									break;
							}
							break;
						case 'input7':
							switch (String(option)) {
								case 'language':
									tab.find('#uifm_fld_inp7_lang').val(value);
									break;
								case 'format':
									tab.find('#uifm_fld_inp7_format').val(value);
									break;
							}
							break;
						case 'input8':
							switch (String(option)) {
								case 'value':
									tab.find('#uifm_fld_input8_value').val(value);
									break;
							}
							break;
						case 'input9':
							switch (String(option)) {
								case 'txt_star1':
									tab.find('#uifm_fld_input9_star1').val(value);
									break;
								case 'txt_star2':
									tab.find('#uifm_fld_input9_star2').val(value);
									break;
								case 'txt_star3':
									tab.find('#uifm_fld_input9_star3').val(value);
									break;
								case 'txt_star4':
									tab.find('#uifm_fld_input9_star4').val(value);
									break;
								case 'txt_star5':
									tab.find('#uifm_fld_input9_star5').val(value);
									break;
								case 'txt_norate':
									tab.find('#uifm_fld_input9_norate').val(value);
									break;
							}
							break;
						case 'input11':
							switch (String(option)) {
								case 'text_val':
									tab.find('#uifm_fld_input11_textval').val(value);
									break;
								case 'text_color':
									tab.find('#uifm_fld_input11_textcolor').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_input11_textcolor').val(value);
									break;
								case 'div_color':
									tab.find('#uifm_fld_input11_barcolor').val(value);
									break;
								case 'div_col_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_input11_divcol_st').prop('checked', true);
									} else {
										tab.find('#uifm_fld_input11_divcol_st').prop('checked', false);
									}
									break;
								case 'text_size':
									tab.find('#uifm_fld_input11_size').selectpicker('val', value);
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_input11_textbold').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_input11_textbold').val(1);
									} else {
										tab.find('#uifm_fld_input11_textbold').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_input11_textbold').val(0);
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_input11_textitalic').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_input11_textitalic').val(1);
									} else {
										tab.find('#uifm_fld_input11_textitalic').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_input11_textitalic').val(0);
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_input11_textu').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_input11_textu').val(1);
									} else {
										tab.find('#uifm_fld_input11_textu').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_input11_textu').val(0);
									}
									break;

								case 'font':
									uiformUpdateFontSelect('uifm_fld_input11_font', value);
									break;
								case 'font_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_input11_font_st').prop('checked', true);
									} else {
										tab.find('#uifm_fld_input11_font_st').prop('checked', false);
									}
									break;
							}
							break;
						case 'input14':
							switch (String(option)) {
								case 'obj_align':
									tab.find('#uifm_fld_inp14_objalign_2').parent().parent().find('input').prop('checked', false);
									tab.find('#uifm_fld_inp14_objalign_2').parent().parent().find('label').removeClass('sfdc-active');
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm_fld_inp14_objalign_2').prop('checked', true);
											tab.find('#uifm_fld_inp14_objalign_2').parent().addClass('sfdc-active');
											break;
										case 2:
											tab.find('#uifm_fld_inp14_objalign_3').prop('checked', true);
											tab.find('#uifm_fld_inp14_objalign_3').parent().addClass('sfdc-active');
											break;
										case 0:
										default:
											tab.find('#uifm_fld_inp14_objalign_1').prop('checked', true);
											tab.find('#uifm_fld_inp14_objalign_1').parent().addClass('sfdc-active');
											break;
									}
									break;
							}
							break;
						case 'input15':
							switch (String(option)) {
								case 'txt_yes':
									tab.find('#uifm_fld_inp15_txt_yes').val(value);
									break;
								case 'txt_no':
									tab.find('#uifm_fld_inp15_txt_no').val(value);
									break;
							}
							break;
						case 'input16':
							switch (String(option)) {
								case 'extallowed':
									tab.find('#uifm_fld_input16_extallowed').val(value);
									break;
								case 'maxsize':
									tab.find('#uifm_fld_input16_maxsize').val(value);
									break;
								case 'attach_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_input16_attachst').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_input16_attachst').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'stl1':
									switch (String(opt2)) {
										case 'txt_selimage':
											tab.find('#uifm_fld_input16_txtselimage').val(value);
											break;
										case 'txt_change':
											tab.find('#uifm_fld_input16_txtchange').val(value);
											break;
										case 'txt_remove':
											tab.find('#uifm_fld_input16_txtremove').val(value);
											break;
									}

									break;
							}
							break;
						case 'input17':
							switch (String(option)) {
								case 'thopt_mode':
									tab.find('#uifm_fld_inp17_thopt_mode').val(value);
									break;
								case 'thopt_height':
									tab.find('#uifm_fld_inp17_thopt_height').val(value);
									break;
								case 'thopt_width':
									tab.find('#uifm_fld_inp17_thopt_width').val(value);
									break;
								case 'thopt_zoom':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp17_thopt_zoom').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_inp17_thopt_zoom').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'thopt_usethmb':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp17_thopt_usethmb').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_inp17_thopt_usethmb').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'thopt_showhvrtxt':
									tab.find('#uifm_fld_inp17_thopt_showhvrtxt').val(value);
									break;
								case 'thopt_showcheckb':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_inp17_thopt_showcheckb').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_inp17_thopt_showcheckb').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'options':
									rocketform.input17settings_tabeditor_generateAllOptions();
									break;
								default:
							}
							break;
						case 'input18':
							switch (String(option)) {
								case 'text':
									switch (String(opt2)) {
										case 'show_st':
											if (parseInt(value) === 1) {
												tab.find('#uifm_frm_inp18_txt_st').bootstrapSwitchZgpb('state', true);
											} else {
												tab.find('#uifm_frm_inp18_txt_st').bootstrapSwitchZgpb('state', false);
											}
											break;
										case 'html_cont':
											if (typeof tinymce != 'undefined') {
												var editor = tinymce.get('uifm_frm_inp18_txt_cont');
												if (editor && editor instanceof tinymce.Editor) {
													var content = decodeURIComponent(value);
													editor.setContent(content, { format: 'html' });
												} else {
													$('textarea#uifm_frm_inp18_txt_cont').val(decodeURIComponent(value));
												}
											} else {
											}
											break;
										case 'html_pos':
											switch (parseInt(value)) {
												case 1:
													tab.find('#uifm_fld_inp18_txt_pos_2').prop('checked', true);
													tab.find('#uifm_fld_inp18_txt_pos_2').parent().addClass('sfdc-active');
													break;
												case 2:
													tab.find('#uifm_fld_inp18_txt_pos_3').prop('checked', true);
													tab.find('#uifm_fld_inp18_txt_pos_3').parent().addClass('sfdc-active');
													break;
												case 3:
													tab.find('#uifm_fld_inp18_txt_pos_4').prop('checked', true);
													tab.find('#uifm_fld_inp18_txt_pos_4').parent().addClass('sfdc-active');
													break;
												case 0:
												default:
													tab.find('#uifm_fld_inp18_txt_pos_1').prop('checked', true);
													tab.find('#uifm_fld_inp18_txt_pos_1').parent().addClass('sfdc-active');
													break;
											}
											break;
									}
									break;
								case 'pane_margin':
									switch (String(opt2)) {
										case 'show_st':
											if (parseInt(value) === 1) {
												tab.find('#uifm_frm_inp18_marg_st').bootstrapSwitchZgpb('state', true);
											} else {
												tab.find('#uifm_frm_inp18_marg_st').bootstrapSwitchZgpb('state', false);
											}
											break;
										case 'pos_top':
											tab.find('#uifm_frm_inp18_marg_top').val(value);
											break;
										case 'pos_right':
											tab.find('#uifm_frm_inp18_marg_right').val(value);
											break;
										case 'pos_bottom':
											tab.find('#uifm_frm_inp18_marg_bottom').val(value);
											break;
										case 'pos_left':
											tab.find('#uifm_frm_inp18_marg_left').val(value);
											break;
									}
									break;
								case 'pane_padding':
									switch (String(opt2)) {
										case 'show_st':
											if (parseInt(value) === 1) {
												tab.find('#uifm_frm_inp18_padd_st').bootstrapSwitchZgpb('state', true);
											} else {
												tab.find('#uifm_frm_inp18_padd_st').bootstrapSwitchZgpb('state', false);
											}
											break;
										case 'pos_top':
											tab.find('#uifm_frm_inp18_padd_top').val(value);
											break;
										case 'pos_right':
											tab.find('#uifm_frm_inp18_padd_right').val(value);
											break;
										case 'pos_bottom':
											tab.find('#uifm_frm_inp18_padd_bottom').val(value);
											break;
										case 'pos_left':
											tab.find('#uifm_frm_inp18_padd_left').val(value);
											break;
									}
									break;
								case 'pane_background':
									switch (String(opt2)) {
										case 'show_st':
											if (parseInt(value) === 1) {
												tab.find('#uifm_frm_inp18_fmbg_st').bootstrapSwitchZgpb('state', true);
											} else {
												tab.find('#uifm_frm_inp18_fmbg_st').bootstrapSwitchZgpb('state', false);
											}
											break;
										case 'type':
											switch (parseInt(value)) {
												case 2:
													tab.find('#uifm_frm_inp18_fmbg_type_2').prop('checked', true);
													tab.find('#uifm_frm_inp18_fmbg_type_2').addClass('sfdc-active');
													tab.find('#uifm_frm_inp18_fmbg_color_1').closest('.sfdc-row').hide();
													tab.find('#uifm_frm_inp18_fmbg_color_2').closest('.sfdc-row').show();
													tab.find('#uifm_frm_inp18_fmbg_color_3').closest('.sfdc-row').show();
													break;
												case 1:
												default:
													tab.find('#uifm_frm_inp18_fmbg_type_1').prop('checked', true);
													tab.find('#uifm_frm_inp18_fmbg_type_1').addClass('sfdc-active');
													tab.find('#uifm_frm_inp18_fmbg_color_1').closest('.sfdc-row').show();
													tab.find('#uifm_frm_inp18_fmbg_color_2').closest('.sfdc-row').hide();
													tab.find('#uifm_frm_inp18_fmbg_color_3').closest('.sfdc-row').hide();
													break;
											}
											break;
										case 'start_color':
											tab.find('#uifm_frm_inp18_fmbg_color_2').parent().colorpicker('setValue', value);
											tab.find('#uifm_frm_inp18_fmbg_color_2').val(value);
											break;
										case 'end_color':
											tab.find('#uifm_frm_inp18_fmbg_color_3').parent().colorpicker('setValue', value);
											tab.find('#uifm_frm_inp18_fmbg_color_3').val(value);
											break;
										case 'solid_color':
											tab.find('#uifm_frm_inp18_fmbg_color_1').parent().colorpicker('setValue', value);
											tab.find('#uifm_frm_inp18_fmbg_color_1').val(value);
											break;
										case 'image':
											if (value) {
												$('#uifm_frm_inp18_bg_imgurl').val(value);
												$('#uifm_frm_inp18_bg_srcimg_wrap').html('<img class="sfdc-img-thumbnail" src="' + value + '">');
											} else {
												$('#uifm_frm_inp18_bg_imgurl').val('');
												$('#uifm_frm_inp18_bg_srcimg_wrap').html('');
											}
											break;
									}
									break;
								case 'pane_border_radius':
									switch (String(opt2)) {
										case 'show_st':
											if (parseInt(value) === 1) {
												tab.find('#uifm_frm_inp18_fmbora_st').bootstrapSwitchZgpb('state', true);
											} else {
												tab.find('#uifm_frm_inp18_fmbora_st').bootstrapSwitchZgpb('state', false);
											}
											break;
										case 'size':
											tab.find('#uifm_frm_inp18_fmbora_size').bootstrapSlider('setValue', parseInt(value));
											break;
									}
									break;
								case 'pane_border':
									switch (String(opt2)) {
										case 'show_st':
											if (parseInt(value) === 1) {
												tab.find('#uifm_frm_inp18_fmbor_st').bootstrapSwitchZgpb('state', true);
											} else {
												tab.find('#uifm_frm_inp18_fmbor_st').bootstrapSwitchZgpb('state', false);
											}
											break;
										case 'color':
											tab.find('#uifm_frm_inp18_fmbor_color').parent().colorpicker('setValue', value);
											tab.find('#uifm_frm_inp18_fmbor_color').val(value);
											break;
										case 'style':
											switch (parseInt(value)) {
												case 2:
													tab.find('#uifm_frm_inp18_fmbor_style_2').prop('checked', true);
													tab.find('#uifm_frm_inp18_fmbor_style_2').addClass('sfdc-active');
													break;
												case 1:
												default:
													tab.find('#uifm_frm_inp18_fmbor_style_1').prop('checked', true);
													tab.find('#uifm_frm_inp18_fmbor_style_1').addClass('sfdc-active');
													break;
											}
											break;
										case 'width':
											tab.find('#uifm_frm_inp18_fmbor_width').bootstrapSlider('setValue', parseInt(value));
											break;
									}
									break;
								case 'pane_shadow':
									switch (String(opt2)) {
										case 'show_st':
											if (parseInt(value) === 1) {
												tab.find('#uifm_frm_inp18_sha_st').bootstrapSwitchZgpb('state', true);
											} else {
												tab.find('#uifm_frm_inp18_sha_st').bootstrapSwitchZgpb('state', false);
											}
											break;
										case 'color':
											tab.find('#uifm_frm_inp18_sha_co').parent().colorpicker('setValue', value);
											tab.find('#uifm_frm_inp18_sha_co').val(value);
											break;
										case 'h_shadow':
											tab.find('#uifm_frm_inp18_sha_x').bootstrapSlider('setValue', parseInt(value));

											break;
										case 'v_shadow':
											tab.find('#uifm_frm_inp18_sha_y').bootstrapSlider('setValue', parseInt(value));
											break;
										case 'blur':
											tab.find('#uifm_frm_inp18_sha_blur').bootstrapSlider('setValue', parseInt(value));
											break;
									}

									break;
								default:
							}
							break;

						case 'input_date2':
							$('#' + id)
								.data('uifm_datepickr_flat')
								.inputsettings_refresh_Options(option, tab, value);
							break;
						case 'label':

							switch (String(option)) {
								case 'text':
									tab.find('#uifm_fld_lbl_txt').val(value);
									break;
								case 'size':
									tab.find('#uifm_fld_lbl_size').selectpicker('val', value);
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_lbl_bold').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_lbl_bold').val(1);
									} else {
										tab.find('#uifm_fld_lbl_bold').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_lbl_bold').val(0);
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_lbl_italic').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_lbl_italic').val(1);
									} else {
										tab.find('#uifm_fld_lbl_italic').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_lbl_italic').val(0);
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_lbl_u').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_lbl_u').val(1);
									} else {
										tab.find('#uifm_fld_lbl_u').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_lbl_u').val(0);
									}
									break;
								case 'color':
									tab.find('#uifm_fld_lbl_color').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_lbl_color').val(value);
									break;
								case 'font':
									uiformUpdateFontSelect('uifm_fld_lbl_font', value);
									break;
								case 'font_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_lbl_font_st').prop('checked', true);
									} else {
										tab.find('#uifm_fld_lbl_font_st').prop('checked', false);
									}
									break;
								case 'shadow_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_lbl_sha_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_lbl_sha_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'shadow_color':
									tab.find('#uifm_fld_lbl_sha_co').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_lbl_sha_co').val(value);
									break;
								case 'shadow_x':
									tab.find('#uifm_fld_lbl_sha_x').bootstrapSlider('setValue', parseInt(value));

									break;
								case 'shadow_y':
									tab.find('#uifm_fld_lbl_sha_y').bootstrapSlider('setValue', parseInt(value));

									break;
								case 'shadow_blur':
									tab.find('#uifm_fld_lbl_sha_blur').bootstrapSlider('setValue', parseInt(value));
									break;

								default:
							}
							break;
						case 'sublabel':
							switch (String(option)) {
								case 'text':
									tab.find('#uifm_fld_sublbl_txt').val(value);
									break;
								case 'size':
									tab.find('#uifm_fld_sublbl_size').selectpicker('val', value);
									break;
								case 'bold':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_sublbl_bold').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_sublbl_bold').val(1);
									} else {
										tab.find('#uifm_fld_sublbl_bold').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_sublbl_bold').val(0);
									}
									break;
								case 'italic':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_sublbl_italic').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_sublbl_italic').val(1);
									} else {
										tab.find('#uifm_fld_sublbl_italic').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_sublbl_italic').val(0);
									}
									break;
								case 'underline':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_sublbl_u').parent().addClass('sfdc-active');
										tab.find('#uifm_fld_sublbl_u').val(1);
									} else {
										tab.find('#uifm_fld_sublbl_u').parent().removeClass('sfdc-active');
										tab.find('#uifm_fld_sublbl_u').val(0);
									}
									break;
								case 'color':
									tab.find('#uifm_fld_sublbl_color').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_sublbl_color').val(value);
									break;
								case 'font':
									uiformUpdateFontSelect('uifm_fld_sublbl_font', value);
									break;
								case 'font_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_sublbl_font_st').prop('checked', true);
									} else {
										tab.find('#uifm_fld_sublbl_font_st').prop('checked', false);
									}
									break;
								case 'shadow_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_sublbl_sha_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_sublbl_sha_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'shadow_color':
									tab.find('#uifm_fld_sublbl_sha_co').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_sublbl_sha_co').val(value);
									break;
								case 'shadow_x':
									tab.find('#uifm_fld_sublbl_sha_x').bootstrapSlider('setValue', parseInt(value));

									break;
								case 'shadow_y':
									tab.find('#uifm_fld_sublbl_sha_y').bootstrapSlider('setValue', parseInt(value));
									break;
								case 'shadow_blur':
									tab.find('#uifm_fld_sublbl_sha_blur').bootstrapSlider('setValue', parseInt(value));
									break;
								default:
							}
							break;
						case 'txt_block':
							switch (String(option)) {
								case 'block_pos':
									$('#uifm_fld_lbl_glay_container').hide();
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm_fld_lbl_blo_pos_2').prop('checked', true);
											tab.find('#uifm_fld_lbl_blo_pos_2').parent().addClass('sfdc-active');
											break;
										case 2:
											tab.find('#uifm_fld_lbl_blo_pos_3').prop('checked', true);
											tab.find('#uifm_fld_lbl_blo_pos_3').parent().addClass('sfdc-active');
											$('#uifm_fld_lbl_glay_container').show();
											break;
										case 3:
											tab.find('#uifm_fld_lbl_blo_pos_4').prop('checked', true);
											tab.find('#uifm_fld_lbl_blo_pos_4').parent().addClass('sfdc-active');
											break;
										case 0:
										default:
											tab.find('#uifm_fld_lbl_blo_pos_1').prop('checked', true);
											tab.find('#uifm_fld_lbl_blo_pos_1').parent().addClass('sfdc-active');
											$('#uifm_fld_lbl_glay_container').show();
											break;
									}
									break;
								case 'block_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_lbl_block_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_lbl_block_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'block_align':
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm_fld_lbl_blo_align_2').prop('checked', true);
											tab.find('#uifm_fld_lbl_blo_align_2').parent().addClass('sfdc-active');
											break;
										case 2:
											tab.find('#uifm_fld_lbl_blo_align_3').prop('checked', true);
											tab.find('#uifm_fld_lbl_blo_align_3').parent().addClass('sfdc-active');
											break;
										case 0:
										default:
											tab.find('#uifm_fld_lbl_blo_align_1').prop('checked', true);
											tab.find('#uifm_fld_lbl_blo_align_1').parent().addClass('sfdc-active');
											break;
									}
									break;
								case 'grid_layout':
									switch (parseInt(value)) {
										case 1:
										case 3:
										case 4:
										case 5:
										case 6:
										case 7:
										case 8:
										case 9:
										case 10:
										case 11:
											tab.find(`#uifm_fld_lbl_glay_pos_${value}`).prop('checked', true);
											tab.find(`#uifm_fld_lbl_glay_pos_${value}`).parent().addClass('sfdc-active');
											break;
										case 2:
										default:
											tab.find('#uifm_fld_lbl_glay_pos_2').prop('checked', true);
											tab.find('#uifm_fld_lbl_glay_pos_2').parent().addClass('sfdc-active');
											break;
									}
									break;
								default:
							}
							break;
						case 'el_background':
						case 'el12_background':
						case 'el13_background':
							switch (String(section)) {
								case 'el_background':
									prefix_ind = '';
									break;
								case 'el12_background':
									prefix_ind = '12';
									break;
								case 'el13_background':
									prefix_ind = '13';
									break;
							}
							switch (String(option)) {
								case 'show_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_elbg' + prefix_ind + '_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_elbg' + prefix_ind + '_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'type':
									switch (parseInt(value)) {
										case 2:
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_type_2')
												.find('input')
												.prop('checked', true);
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_type_2')
												.find('input')
												.parent()
												.addClass('sfdc-active');
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_color_1')
												.closest('.sfdc-row')
												.hide();
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_color_2')
												.closest('.sfdc-row')
												.show();
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_color_3')
												.closest('.sfdc-row')
												.show();
											break;
										case 1:
										default:
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_type_1')
												.find('input')
												.prop('checked', true);
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_type_1')
												.find('input')
												.parent()
												.addClass('sfdc-active');
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_color_1')
												.closest('.sfdc-row')
												.show();
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_color_2')
												.closest('.sfdc-row')
												.hide();
											tab
												.find('#uifm_fld_elbg' + prefix_ind + '_color_3')
												.closest('.sfdc-row')
												.hide();
											break;
									}
									break;
								case 'start_color':
									tab
										.find('#uifm_fld_elbg' + prefix_ind + '_color_2')
										.parent()
										.colorpicker('setValue', value);
									tab.find('#uifm_fld_elbg' + prefix_ind + '_color_2').val(value);
									break;
								case 'end_color':
									tab
										.find('#uifm_fld_elbg' + prefix_ind + '_color_3')
										.parent()
										.colorpicker('setValue', value);
									tab.find('#uifm_fld_elbg' + prefix_ind + '_color_3').val(value);
									break;
								case 'solid_color':
									tab
										.find('#uifm_fld_elbg' + prefix_ind + '_color_1')
										.parent()
										.colorpicker('setValue', value);
									tab.find('#uifm_fld_elbg' + prefix_ind + '_color_1').val(value);
									break;
							}
							break;
						case 'el_border_radius':
						case 'el12_border_radius':
						case 'el13_border_radius':
							switch (String(section)) {
								case 'el_border_radius':
									prefix_ind = '';
									break;
								case 'el12_border_radius':
									prefix_ind = '12';
									break;
								case 'el13_border_radius':
									prefix_ind = '13';
									break;
							}
							switch (String(option)) {
								case 'show_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_elbora' + prefix_ind + '_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_elbora' + prefix_ind + '_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'size':
									tab.find('#uifm_fld_elbora' + prefix_ind + '_size').bootstrapSlider('setValue', parseInt(value));
									break;
							}
							break;
						case 'el_border':
						case 'el12_border':
						case 'el13_border':
							switch (String(section)) {
								case 'el_border':
									prefix_ind = '';
									break;
								case 'el12_border':
									prefix_ind = '12';
									break;
								case 'el13_border':
									prefix_ind = '13';
									break;
							}
							switch (String(option)) {
								case 'show_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_elbor' + prefix_ind + '_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_elbor' + prefix_ind + '_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'color':
									tab
										.find('#uifm_fld_elbor' + prefix_ind + '_color')
										.parent()
										.colorpicker('setValue', value);
									tab.find('#uifm_fld_elbor' + prefix_ind + '_color').val(value);
									break;
								case 'color_focus_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_elbor' + prefix_ind + '_colorfocus_st').prop('checked', true);
									} else {
										tab.find('#uifm_fld_elbor' + prefix_ind + '_colorfocus_st').prop('checked', false);
									}
									break;
								case 'color_focus':
									tab
										.find('#uifm_fld_elbor' + prefix_ind + '_colorfocus')
										.parent()
										.colorpicker('setValue', value);
									tab.find('#uifm_fld_elbor' + prefix_ind + '_colorfocus').val(value);
									break;
								case 'style':
									switch (parseInt(value)) {
										case 2:
											tab
												.find('#uifm_fld_elbor' + prefix_ind + '_style_2')
												.find('input')
												.prop('checked', true);
											tab
												.find('#uifm_fld_elbor' + prefix_ind + '_style_2')
												.find('input')
												.parent()
												.addClass('sfdc-active');
											break;
										case 1:
										default:
											tab
												.find('#uifm_fld_elbor' + prefix_ind + '_style_1')
												.find('input')
												.prop('checked', true);
											tab
												.find('#uifm_fld_elbor' + prefix_ind + '_style_1')
												.find('input')
												.parent()
												.addClass('sfdc-active');
											break;
									}
									break;
								case 'width':
									tab.find('#uifm_fld_elbor' + prefix_ind + '_width').bootstrapSlider('setValue', parseInt(value));
									break;
							}
							break;
						case 'help_block':
							switch (String(option)) {
								case 'text':
									if (typeof tinymce != 'undefined') {
										var editor = tinymce.get('uifm_fld_msc_text');
										if (editor && editor instanceof tinymce.Editor) {
											var content = decodeURIComponent(value);
											editor.setContent(content, { format: 'html' });
										} else {
											$('textarea#uifm_fld_msc_text').val(decodeURIComponent(value));
										}
									} else {
									}

									break;
								case 'show_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_hblock_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_hblock_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'font':
									uiformUpdateFontSelect('uifm_fld_hblock_font', value);
									break;
								case 'font_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_hblock_font_st').prop('checked', true);
									} else {
										tab.find('#uifm_fld_hblock_font_st').prop('checked', false);
									}
									break;
								case 'pos':
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm_fld_hblock_pos_2').prop('checked', true);
											tab.find('#uifm_fld_hblock_pos_2').parent().addClass('sfdc-active');
											break;
										case 2:
											tab.find('#uifm_fld_hblock_pos_3').prop('checked', true);
											tab.find('#uifm_fld_hblock_pos_3').parent().addClass('sfdc-active');
											break;
										case 3:
											tab.find('#uifm_fld_hblock_pos_4').prop('checked', true);
											tab.find('#uifm_fld_hblock_pos_4').parent().addClass('sfdc-active');
											break;
										case 0:
										default:
											tab.find('#uifm_fld_hblock_pos_1').prop('checked', true);
											tab.find('#uifm_fld_hblock_pos_1').parent().addClass('sfdc-active');
											break;
									}
									break;
							}
							break;
						case 'validate':
							switch (String(option)) {
								case 'typ_val':
									$('.uifm-f-setoption-gchecks').removeClass('sfdc-active');
									$('.uifm-custom-validator').hide();
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm-custom-val-alpha-btn').addClass('sfdc-active');
											tab.find('.uifm-custom-val-alpha').show();
											break;
										case 2:
											tab.find('#uifm-custom-val-alphanum-btn').addClass('sfdc-active');
											tab.find('.uifm-custom-val-alphanum').show();
											break;
										case 3:
											tab.find('#uifm-custom-val-num-btn').addClass('sfdc-active');
											tab.find('.uifm-custom-val-num').show();
											break;
										case 4:
											tab.find('#uifm-custom-val-mail-btn').addClass('sfdc-active');
											tab.find('.uifm-custom-val-mail').show();
											break;
										case 5:
											tab.find('#uifm-custom-val-req-btn').addClass('sfdc-active');
											tab.find('.uifm-custom-val-req').show();
											break;
										case 6:
											tab.find('#uifm-custom-val-regex-btn').addClass('sfdc-active');
											tab.find('.uifm-custom-val-req').show();
											break;
									}

									break;
								case 'typ_val_custxt':
									tab.find('.uifm-custom-val-custxt').val(value);
									break;
								case 'customval_regex':
									tab.find('#uifm-custom-val-req-regexinput').val(value);
									break;
								case 'pos':
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm_fld_val_pos_2').prop('checked', true);
											tab.find('#uifm_fld_val_pos_2').parent().addClass('sfdc-active');
											break;
										case 2:
											tab.find('#uifm_fld_val_pos_3').prop('checked', true);
											tab.find('#uifm_fld_val_pos_3').parent().addClass('sfdc-active');
											break;
										case 3:
											tab.find('#uifm_fld_val_pos_4').prop('checked', true);
											tab.find('#uifm_fld_val_pos_4').parent().addClass('sfdc-active');
											break;
										case 0:
										default:
											tab.find('#uifm_fld_val_pos_1').prop('checked', true);
											tab.find('#uifm_fld_val_pos_1').parent().addClass('sfdc-active');
											break;
									}
									break;
								case 'tip_col':
									tab.find('#uifm_fld_val_tipcolor').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_val_tipcolor').val(value);
									break;
								case 'tip_bg':
									tab.find('#uifm_fld_val_tipbg').parent().colorpicker('setValue', value);
									tab.find('#uifm_fld_val_tipbg').val(value);
									break;
								case 'reqicon_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_fld_val_reqicon_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#uifm_fld_val_reqicon_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'reqicon_pos':
									switch (parseInt(value)) {
										case 1:
											tab.find('#uifm_fld_val_reqicon_pos_2').prop('checked', true);
											tab.find('#uifm_fld_val_reqicon_pos_2').addClass('sfdc-active');
											break;
										case 0:
										default:
											tab.find('#uifm_fld_val_reqicon_pos_1').prop('checked', true);
											tab.find('#uifm_fld_val_reqicon_pos_1').addClass('sfdc-active');
											break;
									}
									break;
								case 'reqicon_img':
									tab.find('#uifm_fld_val_reqicon_img').iconpicker('setIcon', value);
									break;
							}
							break;
						case 'clogic':
							switch (String(option)) {
								case 'show_st':
									if (parseInt(value) === 1) {
										tab.find('#uifm_frm_clogic_st').bootstrapSwitchZgpb('state', true);
										tab.find('#uifm-show-conditional-logic').show();
									} else {
										tab.find('#uifm_frm_clogic_st').bootstrapSwitchZgpb('state', false);
										tab.find('#uifm-show-conditional-logic').hide();
									}
									break;
								case 'f_show':
									tab.find('#uifm_frm_clogic_show').val(value);
									break;
								case 'f_all':
									tab.find('#uifm_frm_clogic_all').val(value);
									break;
								case 'list':
									rocketform.clogic_tabeditor_generateAllOptions(value);
									break;
							}
							break;
						case 'skin':
							switch (String(option)) {
								case 'margin':
									switch (String(opt2)) {
										case 'top':
											tab.find('#zgpb_fld_col_margin_top').val(value);
											break;
										case 'bottom':
											tab.find('#zgpb_fld_col_margin_bottom').val(value);

											break;
										case 'left':
											tab.find('#zgpb_fld_col_margin_left').val(value);
											break;
										case 'right':
											tab.find('#zgpb_fld_col_margin_right').val(value);
											break;
									}

									break;
								case 'padding':
									switch (String(opt2)) {
										case 'top':
											tab.find('#zgpb_fld_col_padding_top').val(value);
											break;
										case 'bottom':
											tab.find('#zgpb_fld_col_padding_bottom').val(value);
											break;
										case 'left':
											tab.find('#zgpb_fld_col_padding_left').val(value);
											break;
										case 'right':
											tab.find('#zgpb_fld_col_padding_right').val(value);
											break;
									}
									break;

								case 'custom_css':
									switch (String(opt2)) {
										case 'ctm_id':
											break;
										case 'ctm_class':
											tab.find('#zgpb_fld_col_ctmclass').val(value);
											break;
										case 'ctm_additional':
											tab.find('#zgpb_fld_ctmaddt').val(value);
											break;
									}
									break;
							}
							break;
						default:
							break;
					}
				} catch (ex) {
					console.error('setDataOptToSetTab ', ex.message);
				}
			};

			arguments.callee.enableSettingTabOnPick = function (id, type) {
				switch (parseInt(type)) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						$('#uifm-field-selected-id').val(id);
						$('.uifm-tab-selectedfield').show();
						$('.sfdc-nav-tabs a[href="#uiform-build-field-tab"]').sfdc_tab('show');
						break;
					case 6:
					case 7:
					case 8:
					case 9:
					case 10:
					case 11:
					case 12:
					case 13:
					case 14:
					case 15:
					case 16:
					case 17:
					case 18:
					case 19:
					case 20:
					case 21:

					case 22:

					case 23:

					case 24:

					case 25:

					case 26:

					case 27:

					case 28:
					case 29:
					case 30:

					case 32:

					case 33:

					case 34:
					case 35:
					case 36:
					case 37:
					case 38:
					case 40:
					case 41:

					case 42:
					case 43:

						$('#uifm-field-selected-id').val(id);
						$('.uifm-tab-selectedfield').show();
						$('.sfdc-nav-tabs a[href="#uiform-build-field-tab"]').sfdc_tab('show');
						$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
						break;
					case 31:

					case 39:

						$('#uifm-field-selected-id').val(id);
						$('.uifm-tab-selectedfield').show();

						$('.sfdc-nav-tabs a[href="#uiform-build-field-tab"]').sfdc_tab('show');
						$('.sfdc-nav-tabs a[href="#uiform-settings-tab-2"]').sfdc_tab('show');

						break;
					case 0:
						break;
					default:
				}
			};
			arguments.callee.enableSettingTabOnCreate = function (id, type) {
				try {
					$('#uifm-field-selected-id').val(id);
					$('.uifm-tab-selectedfield').show();
					$('.sfdc-nav-tabs a[href="#uiform-build-field-tab"]').sfdc_tab('show');
				} catch (ex) {
					console.error(' error enableSettingTabOnCreate ', ex.message);
				}
			};
			arguments.callee.loadDataTabFromFStore = function (id, field_type) {
				switch (parseInt(field_type)) {
					case 6:
						$('#' + id)
							.data('uiform_textbox')
							.loadSettingDataTab(id);
						break;
				}
			};

			arguments.callee.loadForm_globalSettings = function () {
				$('#uifm_frm_skin_bg_st').bootstrapSwitchZgpb('state', true);
				$('.uifm_frm_skin_bgcolor_event').colorpicker('setValue', '#eeeeee');
				$('#uifm_frm_skin_bg_color').val('#eeeeee');
				rocketform.loadForm_tab_skin_updateBG();
				$('.sfdc-nav-tabs a[href="#uiform-settings-tab3-2"]').sfdc_tab('show');
			};

			arguments.callee.loadForm_globalSettings_end = function () {};

			arguments.callee.loadFormSaved = function (id) {
				rocketform.showLoader(1, true, true);
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_load_form',
					data: {
						action: 'rocket_fbuilder_load_form',
						page: 'zgfm_form_builder',
						form_id: id,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						rocketform.loadFormToEditPanel(msg);
						rocketform.loading_panelbox('rocketform-bk-dashboard', 0);

						rocketform.refresh_coreData();

						var refreshIntervalId = null;

						var checkIfCoreDataIsSet = function () {
							if (parseInt($('.uiform-main-form').length) != 0) {
								zgfm_back_addon.load_addon();
								clearInterval(refreshIntervalId);
							}
						};
						refreshIntervalId = setInterval(checkIfCoreDataIsSet, 1000);

						rocketform.wizardform_refresh();

						rocketform.formvariables_genListToIntMem();
						rocketform.fieldsdata_email_genListToIntMem();

						zgfm_back_helper.tooltip_removeall();

						enableDraggableItems();
						enableSortableItems();
					}
				});
			};
			arguments.callee.refresh_coreData = function () {
				var tmp_tab_title = mainrformb['steps']['tab_title'];
				var tmp_new_tab_title = [];

				for (var elem in tmp_tab_title) {
					tmp_new_tab_title.push(tmp_tab_title[elem]);
				}
				mainrformb['steps']['tab_title'] = tmp_new_tab_title;

				var tmp_tab_cont = mainrformb['steps']['tab_cont'];
				var tmp_new_tab_cont = [];
				for (var elem in tmp_tab_cont) {
					tmp_new_tab_cont.push(tmp_tab_cont[elem]);
				}
				mainrformb['steps']['tab_cont'] = tmp_new_tab_cont;

				var tmp_steps_src = mainrformb['steps_src'];
				var tmp_new_steps_src = [];
				for (var elem in tmp_steps_src) {
					tmp_new_steps_src.push(tmp_steps_src[elem]);
				}
				mainrformb['steps_src'] = tmp_new_steps_src;

				mainrformb['num_tabs'] = $.map(tmp_new_tab_title, function (n, i) {
					return i;
				}).length;
			};

			arguments.callee.loadFormToEditPanel_default = function (form_data) {
				if (typeof form_data != 'undefined' && form_data) {
					$('#uifm_frm_record_tpl_enable').bootstrapSwitchZgpb('state', form_data.data['fmb_rec_tpl_st']);

					var editor, content;
					if (typeof tinymce != 'undefined' && form_data.data.hasOwnProperty('fmb_rec_tpl_html') && form_data.data['fmb_rec_tpl_html'] != null) {
						editor = tinymce.get('uifm_frm_record_tpl_content');
						if (editor && editor instanceof tinymce.Editor) {
							content = form_data.data['fmb_rec_tpl_html'];
							editor.setContent(content, { format: 'html' });
						} else {
							$('textarea#uifm_frm_record_tpl_content').val(form_data.data['fmb_rec_tpl_html']);
						}
					}
				}

				if (typeof mainrformb['main'] == 'undefined') {
					this.setUiData('main', form_data.data.fmb_data['main']);
				}
				var tab;

				tab = $('#uiform-build-form-tab');

				$.each(mainrformb, function (i, value) {
					switch (String(i)) {
						case 'main':
						case 'onsubm':
							if ($.isPlainObject(value)) {
								$.each(value, function (i2, value2) {
									rocketform.setDataOptToSetFormTab(tab, i, i2, value2);
								});
							} else {
							}
							break;
					}
				});


				var form_tab_skin = this.getUiData('skin');
				tab = $('#uiform-settings-tab3-2');
				var obj_field = $('.uiform-preview-base');
				$.each(form_tab_skin, function (i, value) {
					if ($.isPlainObject(value)) {
						$.each(value, function (i2, value2) {
							rocketform.setDataOptToSetFormTab(tab, 'skin', i + '-' + i2, value2);
							rocketform.setDataOptToPrevForm(obj_field, 'skin', i + '-' + i2, value2);
						});
					} else {
						rocketform.setDataOptToSetFormTab(tab, 'skin', i + '-' + '', value);
						rocketform.setDataOptToPrevForm(obj_field, 'skin', i + '-', value);
					}
				});

				rocketform.loadForm_tab_skin_updateBG();

				var wiz_bg_st = parseInt(this.getUiData2('wizard', 'enable_st')) === 1 ? true : false;

				if (wiz_bg_st) {
					enableSortableItems();
					$('.uiform_frm_wiz_main_content').show();
				} else {
					rocketform.wizardtab_gotoFirstPosition();
					$('.uiform_frm_wiz_main_content').hide();
				}

				rocketform.wizardtab_tabManageEvt();
				rocketform.wizardtab_showOptions();
				rocketform.wizardtab_refreshTabSettings();
				rocketform.wizardtab_refreshPreview();

				rocketform.hideLoader();

				$('a[href="#uiformc-menu-sec1"]').sfdc_tab('show');
				$(window).trigger('resize');
			};

			arguments.callee.loadFormToEditPanel = function (form_data) {
				try {

					var mainrformb_tmp = {
						main: form_data.data.fmb_data['main'],
						skin: form_data.data.fmb_data['skin'],
						wizard: form_data.data.fmb_data['wizard'],
						onsubm: form_data.data.fmb_data['onsubm'],
						num_tabs: form_data.data.fmb_data['num_tabs'],
						steps: form_data.data.fmb_data['steps'],
						steps_src: form_data.data.fmb_data['steps_src']
					};
					mainrformb = $.extend(true, {}, mainrformb, mainrformb_tmp);
					zgfm_back_addon.load_initData(form_data.addons);

					rocketform.saveform_cleanForm2();

					zgfm_back_upgrade.initialize();

					rocketform.guidedtour_showTextOnPreviewPane(false);

					$('.uiform-preview-base').html(form_data.data.fmb_html_backend);

					$('input,textarea').attr('autocomplete', 'off');
					$('#zgfm_edit_panel').disableAutoFill({
						passwordField: '.password'
					});

					if (parseInt($('.uiform-main-form').length) != 0) {
					} else {
						rocketform.loadFormSaved_regenerateForm();
						return;
					}

					$('#uifm_frm_main_title').val(form_data.data.fmb_name);
					$.each(mainrformb['steps_src'], function (index, value) {
						$.each(value, function (index2, value2) {
							rocketform.enableFieldPlugin(index, value2.id, value2.type, value2);
						});
					});

					if (typeof mainrformb['steps'] == 'undefined') {
						mainrformb['steps'] = {};
						this.setUiData('num_tabs', form_data.data.fmb_data['num_tabs']);
						this.setUiData('steps', form_data.data.fmb_data['steps']);
					}

					if (typeof mainrformb['onsubm'] == 'undefined') {
						mainrformb['onsubm'] = {};
						this.setUiData('onsubm', form_data.data.fmb_data['onsubm']);
					}
					if (typeof mainrformb['skin'] == 'undefined') {
						mainrformb['skin'] = {};
						this.setUiData('skin', form_data.data.fmb_data['skin']);
					}

					if (typeof mainrformb['wizard'] == 'undefined') {
						mainrformb['wizard'] = {};
						this.setUiData('wizard', form_data.data.fmb_data['wizard']);
					}
					rocketform.loadFormToEditPanel_default(form_data);
				} catch (ex) {
					console.error(' load form error : ', ex.message);
				}
			};

			arguments.callee.validateFieldOptions = function (data_field) {
				var data_return = {};
				data_return = { data: data_field };
				$.each(data_field, function (index, value) {
					if ($.isPlainObject(value)) {
						$.each(value, function (index2, value2) {
							data_return['data'][index][index2] = rocketform.validateValueFieldOptions(index, index2, value2);
						});
					} else {
						data_return['data'][index] = rocketform.validateValueFieldOptions(index, value, false);
					}
				});

				return data_return;
			};

			arguments.callee.validateValueFieldOptions = function (section, option, value) {
				var value_return;
				value_return = value;
				switch (String(section)) {
					case 'id':
					case 'type_n':
					case 'field_name':
					case 'order_frm':
					case 'order_rec':
						value_return = option;
						break;
					case 'skin':
						value_return = [];
						break;
					case 'type':
						value_return = parseInt(option);
						break;
					case 'input':
						switch (String(option)) {
							case 'value':
								value_return = value;
								break;
							case 'size':
							case 'bold':
							case 'italic':
							case 'underline':
								value_return = parseInt(value);
								break;
							case 'placeholder':
							case 'color':
								value_return = value;
								break;
							case 'font':
								value_return = value;
								this.loadFontSaved(value);
								break;
							case 'font_st':
							case 'val_align':
								value_return = parseInt(value);
								break;
							default:
						}
						break;
					case 'label':
						switch (String(option)) {
							case 'text':
								value_return = value;
								break;
							case 'size':
							case 'bold':
							case 'italic':
							case 'underline':
								value_return = parseInt(value);
								break;
							case 'color':
								value_return = value;
								break;
							case 'font':
								value_return = value;
								this.loadFontSaved(value);
								break;
							case 'font_st':
							case 'shadow_st':
								value_return = parseInt(value);
								break;
							case 'shadow_color':
								value_return = value;
								break;
							case 'shadow_x':
							case 'shadow_y':
							case 'shadow_blur':
								value_return = parseInt(value);
								break;
							default:
						}
						break;
					case 'sublabel':
						switch (String(option)) {
							case 'text':
								value_return = value;
								break;
							case 'size':
							case 'bold':
							case 'italic':
							case 'underline':
								value_return = parseInt(value);
								break;
							case 'color':
								value_return = value;
								break;
							case 'font':
								value_return = value;
								this.loadFontSaved(value);
								break;
							case 'font_st':
							case 'shadow_st':
								value_return = parseInt(value);
								break;
							case 'shadow_color':
								value_return = value;
								break;
							case 'shadow_x':
							case 'shadow_y':
							case 'shadow_blur':
								value_return = parseInt(value);
								break;
							default:
						}
						break;
					case 'txt_block':
						switch (String(option)) {
							case 'block_pos':
							case 'block_st':
							case 'block_align':
								value_return = parseInt(value);
								break;
							default:
						}
						break;
					case 'validate':
						switch (String(option)) {
							case 'typ_val':
								value_return = parseInt(value);

								break;
							case 'typ_val_custxt':
							case 'pos':
							case 'tip_col':
							case 'tip_bg':
							case 'reqicon_st':
							case 'reqicon_pos':
							case 'reqicon_img':
							default:
								value_return = value;
								break;
						}
						break;
					default:
						value_return = value;
						break;
				}

				return value_return;
			};
			arguments.callee.loadFontSaved = function (value) {
				if (value != '') {
					var font = JSON.parse(value);

					if (undefined !== font.import_family) {
						var atImport = '@import url(//fonts.googleapis.com/css?family=' + font.import_family;
						$('<style>').append(atImport).appendTo('head');
					}
				}
			};
			arguments.callee.enableFieldPlugin = function (step_pane, id, field_type, data_field) {
				try {
					var set_option, field_instance;
					var el_table;


					switch (parseInt(field_type)) {
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
						case 12:
						case 13:
						case 14:
						case 15:
						case 16:
						case 17:
						case 18:
						case 19:
						case 20:

						case 21:

						case 22:

						case 23:

						case 24:

						case 25:

						case 26:

						case 27:
						case 28:
						case 29:
						case 30:
						case 31:

						case 32:

						case 39:
						case 40:
						case 41:
						case 42:
						case 43:


							set_option = data_field;

							switch (parseInt(field_type)) {
								case 6:
									$('#' + id).uiform_textbox();
									field_instance = $('#' + id).data('uiform_textbox');
									break;
								case 7:
									$('#' + id).uiform_textarea();
									field_instance = $('#' + id).data('uiform_textarea');
									break;
								case 8:
									$('#' + id).uiform_radiobtn();
									field_instance = $('#' + id).data('uiform_radiobtn');
									break;
								case 9:
									$('#' + id).uiform_checkbox();
									field_instance = $('#' + id).data('uiform_checkbox');
									break;
								case 10:
									$('#' + id).uiform_select();
									field_instance = $('#' + id).data('uiform_select');
									break;
								case 11:
									$('#' + id).uiform_multiselect();
									field_instance = $('#' + id).data('uiform_multiselect');
									break;
								case 12:
									$('#' + id).uiform_fileupload();
									field_instance = $('#' + id).data('uiform_fileupload');
									break;
								case 13:
									$('#' + id).uiform_imageupload();
									field_instance = $('#' + id).data('uiform_imageupload');
									break;
								case 14:
									$('#' + id).uiform_customhtml();
									field_instance = $('#' + id).data('uiform_customhtml');
									break;
								case 15:
									$('#' + id).uiform_password();
									field_instance = $('#' + id).data('uiform_password');
									break;
								case 16:
									$('#' + id).uiform_slider();
									field_instance = $('#' + id).data('uiform_slider');
									break;
								case 17:
									$('#' + id).uiform_range();
									field_instance = $('#' + id).data('uiform_range');
									break;
								case 18:
									$('#' + id).uiform_spinner();
									field_instance = $('#' + id).data('uiform_spinner');
									break;
								case 19:
									$('#' + id).uiform_captcha();
									field_instance = $('#' + id).data('uiform_captcha');
									break;
								case 20:
									$('#' + id).uiform_submitbtn();
									field_instance = $('#' + id).data('uiform_submitbtn');
									break;
								case 21:
									$('#' + id).uiform_hiddeninput();
									field_instance = $('#' + id).data('uiform_hiddeninput');
									break;
								case 22:
									$('#' + id).uiform_ratingstar();
									field_instance = $('#' + id).data('uiform_ratingstar');
									break;
								case 23:
									$('#' + id).uiform_colorpicker();
									field_instance = $('#' + id).data('uiform_colorpicker');
									break;
								case 24:
									$('#' + id).uiform_datepicker();
									field_instance = $('#' + id).data('uiform_datepicker');
									break;
								case 25:
									$('#' + id).uiform_timepicker();
									field_instance = $('#' + id).data('uiform_timepicker');
									break;
								case 26:
									$('#' + id).uiform_datetime();
									field_instance = $('#' + id).data('uiform_datetime');
									break;
								case 27:
									$('#' + id).uiform_recaptcha();
									field_instance = $('#' + id).data('uiform_recaptcha');
									break;
								case 28:
									$('#' + id).uiform_preptext();
									field_instance = $('#' + id).data('uiform_preptext');
									break;
								case 29:
									$('#' + id).uiform_appetext();
									field_instance = $('#' + id).data('uiform_appetext');
									break;
								case 30:
									$('#' + id).uiform_prepapptext();
									field_instance = $('#' + id).data('uiform_prepapptext');
									break;
								case 31:
									$('#' + id).uiform_panelfld();
									field_instance = $('#' + id).data('uiform_panelfld');
									break;
								case 32:
									$('#' + id).uiform_divider();
									field_instance = $('#' + id).data('uiform_divider');
									break;
								case 39:
									$('#' + id).uiform_wizardbtn();
									field_instance = $('#' + id).data('uiform_wizardbtn');
									break;
								case 40:
									$('#' + id).uiform_switch();
									field_instance = $('#' + id).data('uiform_switch');
									break;
								case 41:
									$('#' + id).uiform_dyncheckbox();
									field_instance = $('#' + id).data('uiform_dyncheckbox');
									break;
								case 42:
									$('#' + id).uiform_dynradiobtn();
									field_instance = $('#' + id).data('uiform_dynradiobtn');
									break;
								case 43:
									$('#' + id).uifm_datepickr_flat();
									field_instance = $('#' + id).data('uifm_datepickr_flat');
									break;
							}

							field_instance.update_settingsData(set_option);

							field_instance.setStep(step_pane);

							field_instance.updateVarData(id);

							field_instance.init_events();

							field_instance.setToDatalvl1('id', id);
							field_instance.setDataToCoreStore(step_pane, id);
							field_instance.update_previewfield(id);

							break;
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
							set_option = data_field;

							$('#' + id).zgpbld_gridsystem();

							field_instance = $('#' + id).data('zgpbld_gridsystem');

							field_instance.setToDatalvl1('id', id);

							switch (parseInt(field_type)) {
								case 1:
									field_instance.setToDatalvl1('type', 1);
									field_instance.setToDatalvl1('type_n', 'grid1');
									break;
								case 2:
									field_instance.setToDatalvl1('type', 2);
									field_instance.setToDatalvl1('type_n', 'grid2');
									break;
								case 3:
									field_instance.setToDatalvl1('type', 3);
									field_instance.setToDatalvl1('type_n', 'grid3');
									break;
								case 4:
									field_instance.setToDatalvl1('type', 4);
									field_instance.setToDatalvl1('type_n', 'grid4');
									break;
								case 5:
									field_instance.setToDatalvl1('type', 5);
									field_instance.setToDatalvl1('type_n', 'grid6');
									break;
							}


							field_instance.update_settingsData(set_option);

							field_instance.setStep(step_pane);

							field_instance.updateVarData(id);

							field_instance.setDataToCoreStore(step_pane, id);

							field_instance.update_previewfield(id);

							$('#' + id).zgpbld_grid();

							break;
						case 33:
						case 34:
						case 35:
						case 36:
						case 37:
						case 38:

							set_option = data_field;

							$('#' + id).uiform_heading();

							field_instance = $('#' + id).data('uiform_heading');


							field_instance.setToDatalvl1('id', id);

							field_instance.update_settingsData(set_option);

							field_instance.setStep(step_pane);

							field_instance.init_events();

							field_instance.updateVarData(id);

							switch (parseInt(field_type)) {
								case 33:
									field_instance.setToDatalvl1('type', 33);
									field_instance.setToDatalvl1('type_n', 'heading1');
									break;
								case 34:
									field_instance.setToDatalvl1('type', 34);
									field_instance.setToDatalvl1('type_n', 'heading2');
									break;
								case 35:
									field_instance.setToDatalvl1('type', 35);
									field_instance.setToDatalvl1('type_n', 'heading3');
									break;
								case 36:
									field_instance.setToDatalvl1('type', 36);
									field_instance.setToDatalvl1('type_n', 'heading4');
									break;
								case 37:
									field_instance.setToDatalvl1('type', 37);
									field_instance.setToDatalvl1('type_n', 'heading5');
									break;
								case 38:
									field_instance.setToDatalvl1('type', 38);
									field_instance.setToDatalvl1('type_n', 'heading6');
									break;
							}
							field_instance.setDataToCoreStore(step_pane, id);
							field_instance.update_previewfield(id);
							break;
					}

					enableDraggableItems();
					enableSortableItems();
				} catch (ex) {
					console.error(' enableFieldPlugin error : ', ex.message + ' - type: ' + field_type + ' - id : ' + id + ' - options : ' + rocketform.dumpvar2(set_option));
				}
			};

			arguments.callee.getFieldsAfterDraggable = function (element, field_type, isClicked, id_doubled) {

				this.previewfield_hideAllPopOver();
				var fieldhtml = '',
					id,
					suffixid,
					field_instance;
				rocketform.guidedtour_showTextOnPreviewPane(false);
				var Opt_Doubled = {};
				if (parseInt(id_doubled.length) > 0) {
					var f_step = $('#' + id_doubled)
						.closest('.uiform-step-pane')
						.data('uifm-step');
					var tmp_Opt_Doubled = rocketform.getUiData3('steps_src', f_step, id_doubled);
					var tmp2_Opt_Doubled = $.extend(true, {}, tmp_Opt_Doubled);
					Opt_Doubled = { data: tmp2_Opt_Doubled };
				}

				id = 'ui' + rocketform.generateUniqueID();
				suffixid = rocketform.generateSuffixID(999, 9999);
				var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

				var tmp_fld_load = [];

				var uifm_afterdrag_timer;
				switch (parseInt(field_type)) {
					case 6:
						fieldhtml = $('#uiform-fields-templates .uiform-textbox').clone();
						fieldhtml.attr('id', id);

						if (isClicked) {
							$(element).replaceWith(fieldhtml);
						} else {
							$(element).find('a.uiform-draggable-field').replaceWith(fieldhtml);
						}

						rocketform.loading_boxField(id, 1);


						$('#' + id).uiform_textbox(Opt_Doubled);


						field_instance = $('#' + id).data('uiform_textbox');

						field_instance.setStep(step_pane);
						field_instance.init_events();

						field_instance.setToDatalvl1('id', id);

						field_instance.setFieldName(suffixid);
						field_instance.setDataToCoreStore(step_pane, id);

						var tmp_fld_load_options = rocketform.getInnerVariable('fields_load_settings');

						if (parseInt(tmp_fld_load_options) === 2) {
							rocketform.hideLoader();
							rocketform.loading_boxField(id, 0);
						} else {
							uifm_afterdrag_timer = setInterval(function () {
								if (rocketform.checkIntegrityDataField(id)) {

									rocketform.enableSettingTabOnCreate(fieldhtml.attr('id'), fieldhtml.data('typefield'));

									tmp_fld_load['id'] = fieldhtml.attr('id');
									tmp_fld_load['typefield'] = fieldhtml.data('typefield');
									tmp_fld_load['step_pane'] = step_pane;
									tmp_fld_load['addt'] = null;
									tmp_fld_load['oncreation'] = true;

									rocketform.loadFieldSettingTab(tmp_fld_load);

									rocketform.setHighlightPicked($('#' + id));
									rocketform.hideLoader();


									clearInterval(uifm_afterdrag_timer);
									uifm_afterdrag_timer = null;

								}
							}, 1000);
						}

						break;
					case 7:
						fieldhtml = $('#uiform-fields-templates .uiform-textarea').clone();
						fieldhtml.attr('id', id);
						if (isClicked) {
							$(element).replaceWith(fieldhtml);
						} else {
							$(element).find('a.uiform-draggable-field').replaceWith(fieldhtml);
						}
						rocketform.loading_boxField(id, 1);
						$('#' + id).uiform_textarea(Opt_Doubled);


						field_instance = $('#' + id).data('uiform_textarea');

						field_instance.setStep(step_pane);
						field_instance.init_events();

						field_instance.setToDatalvl1('id', id);
						field_instance.setFieldName(suffixid);
						field_instance.setDataToCoreStore(step_pane, id);

						var tmp_fld_load_options = rocketform.getInnerVariable('fields_load_settings');

						if (parseInt(tmp_fld_load_options) === 2) {
							rocketform.hideLoader();
							rocketform.loading_boxField(id, 0);
						} else {
							uifm_afterdrag_timer = setInterval(function () {
								if (rocketform.checkIntegrityDataField(id)) {
									rocketform.enableSettingTabOnCreate(fieldhtml.attr('id'), fieldhtml.data('typefield'));

									tmp_fld_load['id'] = fieldhtml.attr('id');
									tmp_fld_load['typefield'] = fieldhtml.data('typefield');
									tmp_fld_load['step_pane'] = step_pane;
									tmp_fld_load['addt'] = null;
									tmp_fld_load['oncreation'] = true;

									rocketform.loadFieldSettingTab(tmp_fld_load);

									rocketform.setHighlightPicked($('#' + id));
									rocketform.hideLoader();

									clearInterval(uifm_afterdrag_timer);
									uifm_afterdrag_timer = null;

								}
							}, 1000);
						}

						break;
					case 27:
						fieldhtml = $('#uiform-fields-templates .uiform-recaptcha').clone();
						fieldhtml.attr('id', id);
						fieldhtml.find('.uifm-input-recaptcha').attr('id', 'uifmobj-' + id);
						if (isClicked) {
							$(element).replaceWith(fieldhtml);
						} else {
							$(element).find('a.uiform-draggable-field').replaceWith(fieldhtml);
						}
						rocketform.loading_boxField(id, 1);
						$('#' + id).uiform_recaptcha(Opt_Doubled);

						field_instance = $('#' + id).data('uiform_recaptcha');
						field_instance.setStep(step_pane);
						field_instance.init_events();

						field_instance.setToDatalvl1('id', id);
						field_instance.setDataToCoreStore(step_pane, id);

						var tmp_fld_load_options = rocketform.getInnerVariable('fields_load_settings');

						if (parseInt(tmp_fld_load_options) === 2) {
							rocketform.hideLoader();
							rocketform.loading_boxField(id, 0);
						} else {
							uifm_afterdrag_timer = setInterval(function () {
								if (rocketform.checkIntegrityDataField(id)) {
									rocketform.enableSettingTabOnCreate(fieldhtml.attr('id'), fieldhtml.data('typefield'));
									tmp_fld_load['id'] = fieldhtml.attr('id');
									tmp_fld_load['typefield'] = fieldhtml.data('typefield');
									tmp_fld_load['step_pane'] = step_pane;
									tmp_fld_load['addt'] = null;
									tmp_fld_load['oncreation'] = true;

									rocketform.loadFieldSettingTab(tmp_fld_load);

									rocketform.setHighlightPicked($('#' + id));
									rocketform.hideLoader();

									clearInterval(uifm_afterdrag_timer);
									uifm_afterdrag_timer = null;

								}
							}, 1000);
						}
						break;
					case 8:
					case 9:
					case 10:
					case 11:
					case 12:
					case 13:
					case 14:
					case 15:
					case 16:
					case 17:
					case 18:
					case 19:
					case 20:

					case 21:
					case 22:

					case 23:

					case 24:
					case 25:
					case 26:

					case 28:
					case 29:
					case 30:
					case 31:

					case 32:
					case 39:
					case 40:
					case 41:
					case 42:

					case 43:

						switch (parseInt(field_type)) {
							case 8:
								fieldhtml = $('#uiform-fields-templates .uiform-radiobtn').clone();
								break;
							case 9:
								fieldhtml = $('#uiform-fields-templates .uiform-checkbox').clone();
								break;
							case 10:
								fieldhtml = $('#uiform-fields-templates .uiform-select').clone();
								break;
							case 11:
								fieldhtml = $('#uiform-fields-templates .uiform-multiselect').clone();
								break;
							case 12:
								fieldhtml = $('#uiform-fields-templates .uiform-fileupload').clone();
								break;
							case 13:
								fieldhtml = $('#uiform-fields-templates .uiform-imageupload').clone();
								break;
							case 14:
								fieldhtml = $('#uiform-fields-templates .uiform-customhtml').clone();
								break;
							case 15:
								fieldhtml = $('#uiform-fields-templates .uiform-password').clone();
								break;
							case 16:
								fieldhtml = $('#uiform-fields-templates .uiform-slider').clone();
								break;
							case 17:
								fieldhtml = $('#uiform-fields-templates .uiform-range').clone();
								break;
							case 18:
								fieldhtml = $('#uiform-fields-templates .uiform-spinner').clone();
								break;
							case 19:
								fieldhtml = $('#uiform-fields-templates .uiform-captcha').clone();
								break;
							case 20:
								fieldhtml = $('#uiform-fields-templates .uiform-submitbtn').clone();
								break;
							case 21:
								fieldhtml = $('#uiform-fields-templates .uiform-hiddeninput').clone();
								break;
							case 22:
								fieldhtml = $('#uiform-fields-templates .uiform-ratingstar').clone();
								break;
							case 23:
								fieldhtml = $('#uiform-fields-templates .uiform-colorpicker').clone();
								break;
							case 24:
								fieldhtml = $('#uiform-fields-templates .uiform-datepicker').clone();
								break;
							case 25:
								fieldhtml = $('#uiform-fields-templates .uiform-timepicker').clone();
								break;
							case 26:
								fieldhtml = $('#uiform-fields-templates .uiform-datetime').clone();
								break;
							case 28:
								fieldhtml = $('#uiform-fields-templates .uiform-preptext').clone();
								break;
							case 29:
								fieldhtml = $('#uiform-fields-templates .uiform-appetext').clone();
								break;
							case 30:
								fieldhtml = $('#uiform-fields-templates .uiform-prepapptext').clone();
								break;
							case 31:
								fieldhtml = $('#uiform-fields-templates .uiform-panelfld').clone();
								break;
							case 32:
								fieldhtml = $('#uiform-fields-templates .uiform-divider').clone();
								break;
							case 39:
								fieldhtml = $('#uiform-fields-templates .uiform-wizardbtn').clone();
								break;
							case 40:
								fieldhtml = $('#uiform-fields-templates .uiform-switch').clone();
								break;
							case 41:
								fieldhtml = $('#uiform-fields-templates .uiform-dyncheckbox').clone();
								break;
							case 42:
								fieldhtml = $('#uiform-fields-templates .uiform-dynradiobtn').clone();
								break;
							case 43:
								fieldhtml = $('#uiform-fields-templates .uiform-datetime2').clone();
								break;
						}

						fieldhtml.attr('id', id);
						if (isClicked) {
							$(element).replaceWith(fieldhtml);
						} else {
							$(element).find('a.uiform-draggable-field').replaceWith(fieldhtml);
						}
						rocketform.loading_boxField(id, 1);
						switch (parseInt(field_type)) {
							case 8:
								$('#' + id).uiform_radiobtn(Opt_Doubled);
								break;
							case 9:
								$('#' + id).uiform_checkbox(Opt_Doubled);
								break;
							case 10:
								$('#' + id).uiform_select(Opt_Doubled);
								break;
							case 11:
								$('#' + id).uiform_multiselect(Opt_Doubled);
								break;
							case 12:
								$('#' + id).uiform_fileupload(Opt_Doubled);
								break;
							case 13:
								$('#' + id).uiform_imageupload(Opt_Doubled);
								break;
							case 14:
								$('#' + id).uiform_customhtml(Opt_Doubled);
								break;
							case 15:
								$('#' + id).uiform_password(Opt_Doubled);
								break;
							case 16:
								$('#' + id).uiform_slider(Opt_Doubled);
								break;
							case 17:
								$('#' + id).uiform_range(Opt_Doubled);
								break;
							case 18:
								$('#' + id).uiform_spinner(Opt_Doubled);
								break;
							case 19:
								$('#' + id).uiform_captcha(Opt_Doubled);
								break;
							case 20:
								$('#' + id).uiform_submitbtn(Opt_Doubled);
								break;
							case 21:
								$('#' + id).uiform_hiddeninput(Opt_Doubled);
								break;
							case 22:
								$('#' + id).uiform_ratingstar(Opt_Doubled);
								break;
							case 23:
								$('#' + id).uiform_colorpicker(Opt_Doubled);
								break;
							case 24:
								$('#' + id).uiform_datepicker(Opt_Doubled);
								break;
							case 25:
								$('#' + id).uiform_timepicker(Opt_Doubled);
								break;
							case 26:
								$('#' + id).uiform_datetime(Opt_Doubled);
								break;
							case 28:
								$('#' + id).uiform_preptext(Opt_Doubled);
								break;
							case 29:
								$('#' + id).uiform_appetext(Opt_Doubled);
								break;
							case 30:
								$('#' + id).uiform_prepapptext(Opt_Doubled);
								break;
							case 31:
								$('#' + id).uiform_panelfld(Opt_Doubled);
								break;
							case 32:
								$('#' + id).uiform_divider(Opt_Doubled);
								break;
							case 39:
								$('#' + id).uiform_wizardbtn(Opt_Doubled);
								break;
							case 40:
								$('#' + id).uiform_switch(Opt_Doubled);
								break;
							case 41:
								$('#' + id).uiform_dyncheckbox(Opt_Doubled);
								break;
							case 42:
								$('#' + id).uiform_dynradiobtn(Opt_Doubled);
								break;
							case 43:
								$('#' + id).uifm_datepickr_flat(Opt_Doubled);
								break;
						}

						if (parseInt($('#' + id).parents('.uiform-grid-inner-col').length) != 0) {
							$(window).trigger('resize');
						}
						switch (parseInt(field_type)) {
							case 8:
								field_instance = $('#' + id).data('uiform_radiobtn');
								field_instance.setFieldName(suffixid);
								break;
							case 9:
								field_instance = $('#' + id).data('uiform_checkbox');
								field_instance.setFieldName(suffixid);
								break;
							case 10:
								field_instance = $('#' + id).data('uiform_select');
								field_instance.setFieldName(suffixid);
								break;
							case 11:
								field_instance = $('#' + id).data('uiform_multiselect');
								field_instance.setFieldName(suffixid);
								break;
							case 12:
								field_instance = $('#' + id).data('uiform_fileupload');
								field_instance.setFieldName(suffixid);
								break;
							case 13:
								field_instance = $('#' + id).data('uiform_imageupload');
								field_instance.setFieldName(suffixid);
								break;
							case 14:
								field_instance = $('#' + id).data('uiform_customhtml');
								break;
							case 15:
								field_instance = $('#' + id).data('uiform_password');
								field_instance.setFieldName(suffixid);
								break;
							case 16:
								field_instance = $('#' + id).data('uiform_slider');
								field_instance.setFieldName(suffixid);
								break;
							case 17:
								field_instance = $('#' + id).data('uiform_range');
								field_instance.setFieldName(suffixid);
								break;
							case 18:
								field_instance = $('#' + id).data('uiform_spinner');
								field_instance.setFieldName(suffixid);
								break;
							case 19:
								field_instance = $('#' + id).data('uiform_captcha');
								break;
							case 20:
								field_instance = $('#' + id).data('uiform_submitbtn');
								break;
							case 21:
								field_instance = $('#' + id).data('uiform_hiddeninput');
								field_instance.setFieldName(suffixid);
								break;
							case 22:
								field_instance = $('#' + id).data('uiform_ratingstar');
								field_instance.setFieldName(suffixid);
								break;
							case 23:
								field_instance = $('#' + id).data('uiform_colorpicker');
								field_instance.setFieldName(suffixid);
								break;
							case 24:
								field_instance = $('#' + id).data('uiform_datepicker');
								field_instance.setFieldName(suffixid);
								break;
							case 25:
								field_instance = $('#' + id).data('uiform_timepicker');
								field_instance.setFieldName(suffixid);
								break;
							case 26:
								field_instance = $('#' + id).data('uiform_datetime');
								field_instance.setFieldName(suffixid);
								break;
							case 28:
								field_instance = $('#' + id).data('uiform_preptext');
								field_instance.setFieldName(suffixid);
								break;
							case 29:
								field_instance = $('#' + id).data('uiform_appetext');
								field_instance.setFieldName(suffixid);
								break;
							case 30:
								field_instance = $('#' + id).data('uiform_prepapptext');
								field_instance.setFieldName(suffixid);
								break;
							case 31:
								field_instance = $('#' + id).data('uiform_panelfld');

								break;
							case 32:
								field_instance = $('#' + id).data('uiform_divider');
								rocketform.previewform_elementBackground($('.uiform-main-form'), false);
								break;
							case 39:
								field_instance = $('#' + id).data('uiform_wizardbtn');
								rocketform.previewform_elementBackground($('.uiform-main-form'), false);
								break;
							case 40:
								field_instance = $('#' + id).data('uiform_switch');
								field_instance.setFieldName(suffixid);
								break;
							case 41:
								field_instance = $('#' + id).data('uiform_dyncheckbox');
								field_instance.setFieldName(suffixid);
								break;
							case 42:
								field_instance = $('#' + id).data('uiform_dynradiobtn');
								field_instance.setFieldName(suffixid);
								break;
							case 43:
								field_instance = $('#' + id).data('uifm_datepickr_flat');
								field_instance.setFieldName(suffixid);
								break;
						}

						field_instance.setStep(step_pane);

						field_instance.init_events();

						field_instance.setToDatalvl1('id', id);

						field_instance.setDataToCoreStore(step_pane, id);
						var tmp_fld_load_options = rocketform.getInnerVariable('fields_load_settings');

						if (parseInt(tmp_fld_load_options) === 2) {
							rocketform.hideLoader();
							rocketform.loading_boxField(id, 0);
						} else {
							uifm_afterdrag_timer = setInterval(function () {
								if (rocketform.checkIntegrityDataField(id)) {
									rocketform.enableSettingTabOnCreate(fieldhtml.attr('id'), fieldhtml.data('typefield'));

									tmp_fld_load['id'] = fieldhtml.attr('id');
									tmp_fld_load['typefield'] = fieldhtml.data('typefield');
									tmp_fld_load['step_pane'] = step_pane;
									tmp_fld_load['addt'] = null;
									tmp_fld_load['oncreation'] = true;

									rocketform.loadFieldSettingTab(tmp_fld_load);

									rocketform.setHighlightPicked($('#' + id));

									rocketform.hideLoader();

									clearInterval(uifm_afterdrag_timer);
									uifm_afterdrag_timer = null;

								}
							}, 1000);
						}
						break;
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						switch (parseInt(field_type)) {
							case 1:
								fieldhtml = $('#uiform-fields-templates .zgpb-gridsystem-one').clone();
								break;
							case 2:
								fieldhtml = $('#uiform-fields-templates .zgpb-gridsystem-two').clone();
								break;
							case 3:
								fieldhtml = $('#uiform-fields-templates .zgpb-gridsystem-three').clone();
								break;
							case 4:
								fieldhtml = $('#uiform-fields-templates .zgpb-gridsystem-four').clone();
								break;
							case 5:
								fieldhtml = $('#uiform-fields-templates .zgpb-gridsystem-five').clone();
								break;
						}

						fieldhtml.attr('id', id);
						if (isClicked) {
							$(element).replaceWith(fieldhtml);
						} else {
							$(element).find('a.uiform-draggable-field').replaceWith(fieldhtml);
						}
						rocketform.loading_boxField(id, 1);
						$('#' + id).zgpbld_gridsystem();

						field_instance = $('#' + id).data('zgpbld_gridsystem');

						field_instance.setToDatalvl1('id', id);
						switch (parseInt(field_type)) {
							case 1:
								field_instance.setToDatalvl1('type', 1);
								field_instance.setToDatalvl1('type_n', 'grid1_');
								break;
							case 2:
								field_instance.setToDatalvl1('type', 2);
								field_instance.setToDatalvl1('type_n', 'grid2_');
								break;
							case 3:
								field_instance.setToDatalvl1('type', 3);
								field_instance.setToDatalvl1('type_n', 'grid3_');
								break;
							case 4:
								field_instance.setToDatalvl1('type', 4);
								field_instance.setToDatalvl1('type_n', 'grid4_');
								break;
							case 5:
								field_instance.setToDatalvl1('type', 5);
								field_instance.setToDatalvl1('type_n', 'grid6_');
								break;
						}

						field_instance.createBlockAttributes();

						field_instance.update_settingsData(Opt_Doubled);

						field_instance.setToDatalvl1('id', id);

						field_instance.setFieldName(suffixid);

						field_instance.setStep(step_pane);

						field_instance.updateVarData(id);

						field_instance.setDataToCoreStore(step_pane, id);

						$('#' + id).zgpbld_grid();

						rocketform.hideLoader();
						var tmp_fld_load_options = rocketform.getInnerVariable('fields_load_settings');

						if (parseInt(tmp_fld_load_options) === 2) {
							rocketform.hideLoader();
							rocketform.loading_boxField(id, 0);
						} else {
							uifm_afterdrag_timer = setInterval(function () {
								if (rocketform.checkIntegrityDataField(id)) {
									rocketform.enableSettingTabOnCreate(fieldhtml.attr('id'), fieldhtml.data('typefield'));

									tmp_fld_load['id'] = fieldhtml.attr('id');
									tmp_fld_load['typefield'] = fieldhtml.data('typefield');
									tmp_fld_load['step_pane'] = step_pane;
									tmp_fld_load['addt'] = null;
									tmp_fld_load['oncreation'] = true;

									rocketform.loadFieldSettingTab(tmp_fld_load);



									rocketform.hideLoader();

									clearInterval(uifm_afterdrag_timer);
									uifm_afterdrag_timer = null;
								}
							}, 1000);
						}

						break;
					case 33:
					case 34:
					case 35:
					case 36:
					case 37:
					case 38:
						switch (parseInt(field_type)) {
							case 33:
								fieldhtml = $('#uiform-fields-templates .uiform-heading1').clone();
								break;
							case 34:
								fieldhtml = $('#uiform-fields-templates .uiform-heading2').clone();
								break;
							case 35:
								fieldhtml = $('#uiform-fields-templates .uiform-heading3').clone();
								break;
							case 36:
								fieldhtml = $('#uiform-fields-templates .uiform-heading4').clone();
								break;
							case 37:
								fieldhtml = $('#uiform-fields-templates .uiform-heading5').clone();
								break;
							case 38:
								fieldhtml = $('#uiform-fields-templates .uiform-heading6').clone();
								break;
						}

						fieldhtml.attr('id', id);
						if (isClicked) {
							$(element).replaceWith(fieldhtml);
						} else {
							$(element).find('a.uiform-draggable-field').replaceWith(fieldhtml);
						}
						rocketform.loading_boxField(id, 1);
						$('#' + id).uiform_heading(Opt_Doubled);
						field_instance = $('#' + id).data('uiform_heading');
						field_instance.setStep(step_pane);
						field_instance.init_events();

						field_instance.setToDatalvl1('id', id);

						if (
							parseInt(
								$.map(Opt_Doubled, function (n, i) {
									return i;
								}).length
							) == 0
						) {
							switch (parseInt(field_type)) {
								case 33:
									field_instance.setToDatalvl1('type', 33);
									field_instance.setToDatalvl1('type_n', 'heading1');
									field_instance.setToDatalvl2('input', 'value', 'Type your heading H1 here');
									field_instance.setToDatalvl2('input', 'size', '32');
									break;
								case 34:
									field_instance.setToDatalvl1('type', 34);
									field_instance.setToDatalvl1('type_n', 'heading2');
									field_instance.setToDatalvl2('input', 'value', 'Type your heading H2 here');
									field_instance.setToDatalvl2('input', 'size', '24');
									break;
								case 35:
									field_instance.setToDatalvl1('type', 35);
									field_instance.setToDatalvl1('type_n', 'heading3');
									field_instance.setToDatalvl2('input', 'value', 'Type your heading H3 here');
									field_instance.setToDatalvl2('input', 'size', '20');
									break;
								case 36:
									field_instance.setToDatalvl1('type', 36);
									field_instance.setToDatalvl1('type_n', 'heading4');
									field_instance.setToDatalvl2('input', 'value', 'Type your heading H4 here');
									field_instance.setToDatalvl2('input', 'size', '16');
									break;
								case 37:
									field_instance.setToDatalvl1('type', 37);
									field_instance.setToDatalvl1('type_n', 'heading5');
									field_instance.setToDatalvl2('input', 'value', 'Type your heading H5 here');
									field_instance.setToDatalvl2('input', 'size', '13');
									break;
								case 38:
									field_instance.setToDatalvl1('type', 38);
									field_instance.setToDatalvl1('type_n', 'heading6');
									field_instance.setToDatalvl2('input', 'value', 'Type your heading H6 here');
									field_instance.setToDatalvl2('input', 'size', '10');
									break;
							}
						}

						field_instance.setDataToCoreStore(step_pane, id);

						rocketform.hideLoader();

						var tmp_fld_load_options = rocketform.getInnerVariable('fields_load_settings');

						if (parseInt(tmp_fld_load_options) === 2) {
							rocketform.hideLoader();
							rocketform.loading_boxField(id, 0);
						} else {
							uifm_afterdrag_timer = setInterval(function () {
								if (rocketform.checkIntegrityDataField(id)) {
									rocketform.enableSettingTabOnCreate(fieldhtml.attr('id'), fieldhtml.data('typefield'));

									tmp_fld_load['id'] = fieldhtml.attr('id');
									tmp_fld_load['typefield'] = fieldhtml.data('typefield');
									tmp_fld_load['step_pane'] = step_pane;
									tmp_fld_load['addt'] = null;
									tmp_fld_load['oncreation'] = true;

									rocketform.loadFieldSettingTab(tmp_fld_load);

									rocketform.setHighlightPicked($('#' + id));
									rocketform.hideLoader();

									clearInterval(uifm_afterdrag_timer);
									uifm_afterdrag_timer = null;

								}
							}, 1000);
						}

						break;
				}

				rocketform.formvariables_generateTable();

				var field_handle1 = $(element).find('.uiform-field-move');
				field_handle1
					.mouseover(function () {
						$(this).css('overflow', 'hidden');
						$(this).css('cursor', 'move');
					})
					.mouseout(function () {
						$(this).css('overflow', 'visible');
					});
				enableDraggableItems();
				enableSortableItems();

				zgfm_back_err.integrity_check();
				let tmp_addon_arr = uiform_vars.addon;

				var tmp_function;
				var tmp_controller;

				for (var property1 in tmp_addon_arr) {
					if ('onFieldCreation_post' === String(property1)) {
						for (var property2 in tmp_addon_arr[property1]) {
							for (var property3 in tmp_addon_arr[property1][property2]) {
								tmp_controller = tmp_addon_arr[property1][property2][property3]['controller'];
								tmp_function = tmp_addon_arr[property1][property2][property3]['function'];
								window[tmp_controller][tmp_function]();
							}
						}
					}
				}

				return id;
			};
			arguments.callee.captureEventTinyMCE_process = function (tab_opt, f_id, f_content) {
				if ($('#uiform-build-field-tab').hasClass('zgfm-fieldtab-flag-loading')) {
					return;
				}

				var store;
				switch (tab_opt) {
					case 'uifm_fld_msc_text':
						store = 'help_block-text';
						break;
					case 'uifm_fld_inp3_html':
						store = 'input3-text';
						break;
					case 'uifm_fld_price_lbl_format':
						store = 'price-lbl_show_format';
						break;
					case 'uifm_frm_summbox_skintxt_txt':
						store = 'skin_text-text';
						break;
					case 'uifm_frm_inp18_txt_cont':
						store = 'input18-text-html_cont';
						break;
					default:
				}

				var f_store, f_sec, f_opt, f_val, f_step, obj_field;
				switch (tab_opt) {
					case 'uifm_fld_msc_text':
					case 'uifm_fld_inp3_html':
					case 'uifm_fld_price_lbl_format':
					case 'uifm_frm_inp18_txt_cont':
						if (store) {
							f_val = encodeURIComponent(f_content);
							f_step = $('#' + f_id)
								.closest('.uiform-step-pane')
								.data('uifm-step');
							rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
							obj_field = $('#' + f_id);
							if (obj_field) {
								rocketform.setDataOptToPrevField(obj_field, store, f_val);
							}
						}
						break;
					case 'uifm_frm_summbox_skintxt_txt':
						if (store) {
							f_store = store.split('-');
							f_sec = f_store[0];
							f_opt = f_store[1];
							f_val = encodeURIComponent(f_content);
							rocketform.setUiData3('summbox', f_sec, f_opt, f_val);
							obj_field = $('.uiform-preview-base');
							if (obj_field) {
								rocketform.setDataOptToPrevForm(obj_field, 'summbox', f_sec + '-' + f_opt, f_val);
							}
						}
						break;
					default:
				}
			};
			arguments.callee.captureEventTinyMCE2 = function (e) {
				var tab_opt = $(e.target).attr('id');
				var tmp_content = $(e.target).val();
				var tmp_id = $('#uifm-field-selected-id').val();

				switch (tab_opt) {
					case 'uifm_frm_subm_msg':
					case 'uifm_frm_email_usr_tmpl':
					case 'uifm_frm_email_tmpl':
					case 'uifm_frm_email_usr_tmpl_pdf':
						if (typeof tinymce != 'undefined') {
							editor = tinymce.get(tab_opt);
							if (editor && editor instanceof tinymce.Editor) {
								tinymce.get(tab_opt).setContent(tmp_content);
							}
						}
						break;
					default:
						rocketform.captureEventTinyMCE_process(tab_opt, tmp_id, tmp_content);
				}
			};
			arguments.callee.captureEventTinyMCE = function (ed, e) {
				var tab_opt = ed.id;
				switch (tab_opt) {
					case 'uifm_frm_subm_msg':
					case 'uifm_frm_email_usr_tmpl':
					case 'uifm_frm_email_tmpl':
					case 'uifm_frm_email_usr_tmpl_pdf':
						$('#' + tab_opt).val(ed.getContent());
						break;
					default:
						var tmp_id = $('#uifm-field-selected-id').val();
						var tmp_content = ed.getContent();
						rocketform.captureEventTinyMCE_process(tab_opt, tmp_id, tmp_content);
				}

				var addon_data = {};
				addon_data['textarea_id'] = tab_opt;
				addon_data['field_id'] = tmp_id;
				addon_data['textarea_content'] = tmp_content;
				zgfm_back_addon.do_action('tinyMCE_onChange', addon_data);
			};
			arguments.callee.initPanel = function () {
				this.loading_panelbox('rocketform-bk-dashboard', 1);
			};
			arguments.callee.showLogMessage = function (msg) {
				console.log(msg);
			};
			arguments.callee.printmaindata = function () {
				console.log(this.dumpvar3(mainrformb));
			};
			arguments.callee.redirect_tourl = function (redirect) {
				if (window.event) {
					window.event.returnValue = false;
					window.location = redirect;
				} else {
					location.href = redirect;
				}
			};
			arguments.callee.getLayoutFormByStep_checkInColumn = function (children, f_step, type) {
				var fields = {};
				var values_tmp, el_container, el_id, el_type, el_children_count, el_children, children_tmp_a, children_tmp_ob, child_id, check_field, num_columns;

				var tmp_wrap_class = '';

				switch (parseInt(type)) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						tmp_wrap_class = '.zgpb-fl-gs-block-inner > .uiform-field';
						break;
					case 31:
						tmp_wrap_class = '.uiform-grid-inner-col > .uiform-field';
						break;
				}

				$(children)
					.find(tmp_wrap_class)
					.each(function (index, element) {
						values_tmp = {};
						children_tmp_ob = {};
						children_tmp_a = [];
						element = $(element);
						el_container = element.data('iscontainer') ? element.data('iscontainer') : 0;
						values_tmp.iscontainer = parseInt(el_container);
						el_type = element.data('typefield');
						values_tmp.type = el_type;
						el_id = element.attr('id') ? element.attr('id') : 0;
						values_tmp.id = el_id;
						values_tmp.num_tab = parseInt(f_step);

						if (el_container === 1) {
							values_tmp.children = {};
							el_children_count = element.find('.uiform-field').length;
							values_tmp.count_children = parseInt(el_children_count);
							el_children = element.find('.uiform-field');
							if (parseInt(el_children_count) > 0) {
								$(el_children).each(function (index2, element2) {
									child_id = $(this).attr('id') ? $(this).attr('id') : 0;
									children_tmp_a.push(child_id);
								});
								values_tmp.children_str = children_tmp_a.join(',');
							}
							values_tmp.inner = rocketform.getLayoutFormByStep_checkChildren(el_id, el_children, el_type, element, f_step);
						}

						check_field = $.inArray(el_id, rocketform.getInnerVariable('fields_flag_stored'));
						if (check_field < 0) {
							rocketform.getLayoutFormByStep_addFieldFlag(el_id);
							fields[index] = values_tmp;
						}
					});
				return fields;
			};

			arguments.callee.getLayoutFormByStep_checkChildren = function (id, children, type, el, f_step) {
				var fields = {};
				var num_columns, values_tmp, num_cols;

				switch (parseInt(type)) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						num_columns = el.find('.sfdc-row:eq(0) > .zgpb-fl-gs-block-style');
						num_columns.each(function (index, element) {
							values_tmp = {};
							element = $(element);
							num_cols = element.attr('data-zgpb-blockcol');
							blocknum_cols = element.attr('data-zgpb-blocknum');
							values_tmp.cols = num_cols;

							values_tmp.num_tab = blocknum_cols;

							values_tmp.children = rocketform.getLayoutFormByStep_checkInColumn(num_columns[index], f_step, type);

							fields[index] = values_tmp;
						});
						break;
					case 31:
						values_tmp = {};

						values_tmp.cols = 0;
						values_tmp.num_tab = parseInt(f_step);

						values_tmp.children = rocketform.getLayoutFormByStep_checkInColumn($(el).find('.uifm-input31-main-wrap').first(), f_step, type);

						fields[0] = values_tmp;

						break;
					case 0:
						break;
					default:
				}
				return fields;
			};
			arguments.callee.getLayoutFormByStep_addFieldFlag = function (value) {
				var temp;
				temp = this.getInnerVariable('fields_flag_stored');
				temp.push(value);
				this.setInnerVariable('fields_flag_stored', temp);
			};
			arguments.callee.getLayoutFormByStep = function (f_step) {
				if ($('#uifm-step-tab-' + f_step)) {
					var fields = {};
					var values_tmp, el_container, el_id, el_type, el_children_count, el_children, children_tmp_a, children_tmp_ob, child_id, check_field;

					rocketform.setInnerVariable('fields_flag_stored', []);

					$('#uifm-step-tab-' + f_step + ' .uiform-field').each(function (index, element) {
						values_tmp = {};
						children_tmp_ob = {};
						children_tmp_a = [];
						element = $(element);
						el_container = element.data('iscontainer') ? element.data('iscontainer') : 0;
						values_tmp.iscontainer = parseInt(el_container);
						values_tmp.num_tab = parseInt(f_step);

						el_type = element.data('typefield');
						values_tmp.type = el_type;
						el_id = element.attr('id') ? element.attr('id') : 0;
						values_tmp.id = el_id;

						if (el_container === 1) {
							values_tmp.children = {};
							el_children_count = element.find('.uiform-field').length;
							values_tmp.count_children = parseInt(el_children_count);

							el_children = element.find('.uiform-field') || null;
							if (parseInt(el_children_count) > 0) {
								children_tmp_a = [];
								$(el_children).each(function (index2, element2) {
									child_id = $(this).attr('id') ? $(this).attr('id') : 0;
									children_tmp_a.push(child_id);
								});
								values_tmp.children_str = children_tmp_a.join(',');
							}

							values_tmp.inner = rocketform.getLayoutFormByStep_checkChildren(el_id, el_children, el_type, element, f_step);
						}

						check_field = $.inArray(el_id, rocketform.getInnerVariable('fields_flag_stored'));
						if (check_field < 0) {
							rocketform.getLayoutFormByStep_addFieldFlag(el_id);
							fields[index] = values_tmp;
						} else {
						}
					});
				}
				return fields;
			};

			arguments.callee.loadNewForm = function () {
				rocketform.loadFormToEditPanel_default(null);

				if (parseInt($('#rocketform-bk-dashboard').length) != 0) {
					rocketform.loading_panelbox('rocketform-bk-dashboard', 0);
				}
				rocketform.formvariables_genListToIntMem();

				zgfm_back_addon.load_addon();
			};
			arguments.callee.formsetting_setFieldName = function () {
				var modal_obj = $('#uifm_form_setting_setfname');
				modal_obj.sfdc_modal({
					show: true,
					backdrop: 'static',
					keyboard: false
				});
				modal_obj.on('show.bs.modal', rocketform.modal_centerPos(modal_obj));
			};
			arguments.callee.formsetting_setFieldName_check = function () {
				var modal_obj = $('#uifm_form_setting_setfname');

				modal_obj.sfdc_modal('hide');
			};
			arguments.callee.saveTabContent = function () {
				var tab_content = {},
					tab_titles = {},
					tabcontent_tmp,
					tabtitle_tmp;
				var var_steps_src = this.getUiData('steps_src');

				$.each(var_steps_src, function (i, value) {
					tabcontent_tmp = {};
					tabcontent_tmp.content = rocketform.getLayoutFormByStep(i);
					tab_content[i] = tabcontent_tmp;
				});

				this.setUiData2('steps', 'tab_cont', tab_content);

				var editor, content;
				mainrformb['onsubm'] = {};
				var onsubm_msgsuc;
				if (typeof tinymce != 'undefined') {
					editor = tinymce.get('uifm_frm_subm_msg');
					if (editor && editor instanceof tinymce.Editor) {
						onsubm_msgsuc = tinymce.get('uifm_frm_subm_msg').getContent();
					} else {
						onsubm_msgsuc = $('#uifm_frm_subm_msg').val() ? $('#uifm_frm_subm_msg').val() : '';
					}
				}
				var onsubm_bg_st = $('#uifm_frm_subm_bgst').prop('checked') ? 1 : 0;
				var onsubm_bg_type = $('#uifm_frm_subm_bgst_handle').find('input:checked') ? $('#uifm_frm_subm_bgst_handle').find('input:checked').val() : 1;
				var onsubm_bg_solid = $('#uifm_frm_subm_bgst_typ1_col').val();
				var onsubm_bg_start = $('#uifm_frm_subm_bgst_typ2_col1').val();
				var onsubm_bg_end = $('#uifm_frm_subm_bgst_typ2_col2').val();
				var onsubm_redirect_st = $('#uifm_frm_subm_redirect_st').bootstrapSwitchZgpb('state') ? 1 : 0;
				var onsubm_redirect_url = $('#uifm_frm_subm_redirect_url').val();
				this.setUiData2('onsubm', 'sm_successtext', encodeURIComponent(onsubm_msgsuc));
				this.setUiData2('onsubm', 'sm_boxmsg_bg_st', onsubm_bg_st);
				this.setUiData2('onsubm', 'sm_boxmsg_bg_type', onsubm_bg_type);
				this.setUiData2('onsubm', 'sm_boxmsg_bg_solid', onsubm_bg_solid);
				this.setUiData2('onsubm', 'sm_boxmsg_bg_start', onsubm_bg_start);
				this.setUiData2('onsubm', 'sm_boxmsg_bg_end', onsubm_bg_end);
				this.setUiData2('onsubm', 'sm_redirect_st', onsubm_redirect_st);
				this.setUiData2('onsubm', 'sm_redirect_url', encodeURIComponent(onsubm_redirect_url));
				var main_addcss = $('textarea#uifm_frm_main_addcss').data('CodeMirrorInstance').getValue();
				var main_addjs = $('textarea#uifm_frm_main_addjs').data('CodeMirrorInstance').getValue();
				var main_onload_scroll = $('#uifm_frm_main_onload_scroll').prop('checked') ? 1 : 0;
				var main_preload_noconf = $('#uifm_frm_main_preload_noconflict').prop('checked') ? 1 : 0;
				this.setUiData2('main', 'add_css', encodeURIComponent(main_addcss));
				this.setUiData2('main', 'add_js', encodeURIComponent(main_addjs));
				this.setUiData2('main', 'onload_scroll', main_onload_scroll);
				this.setUiData2('main', 'preload_noconflict', main_preload_noconf);

				var main_pdf_onpage = $('#uifm_frm_main_pdf_show_onpage').bootstrapSwitchZgpb('state') ? 1 : 0;
				this.setUiData2('main', 'pdf_show_onpage', main_pdf_onpage);
				this.setUiData2('main', 'pdf_paper_size', $('#uifm_frm_main_pdf_papersize').val());

				this.setUiData2('main', 'pdf_paper_orie', $('#uifm_frm_main_pdf_paperorien').val());
				var mail_usr_pdf_font = $('#uifm_frm_email_usr_tmpl_pdf_font').val();
				this.setUiData2('main', 'pdf_font', mail_usr_pdf_font);

				var mail_usr_pdf_charset = $('#uifm_frm_email_usr_pdf_charset').val();
				this.setUiData2('main', 'pdf_charset', mail_usr_pdf_charset);

				var mail_usr_email_html_fullpage = $('#uifm_frm_main_email_htmlfullpage').bootstrapSwitchZgpb('state') ? 1 : 0;
				this.setUiData2('main', 'email_html_fullpage', mail_usr_email_html_fullpage);

				var mail_usr_pdf_html_fullpage = $('#uifm_frm_main_pdf_htmlfullpage').bootstrapSwitchZgpb('state') ? 1 : 0;
				this.setUiData2('main', 'email_pdf_fullpage', mail_usr_pdf_html_fullpage);
				if ($('#uifm_frm_main_email_dissubm').length) {
					var email_dissubm = $('#uifm_frm_main_email_dissubm').bootstrapSwitchZgpb('state') ? 1 : 0;
					this.setUiData2('main', 'email_dissubm', email_dissubm);
				}
				var email_template_msg;

				var mail_from_email = $('#uifm_frm_from_email').val();
				var mail_from_name = $('#uifm_frm_from_name').val();
				this.setUiData2('onsubm', 'mail_from_email', mail_from_email);
				this.setUiData2('onsubm', 'mail_from_name', mail_from_name);

				if (typeof tinymce != 'undefined') {
					editor = tinymce.get('uifm_frm_email_tmpl');
					if (editor && editor instanceof tinymce.Editor) {
						email_template_msg = tinymce.get('uifm_frm_email_tmpl').getContent();
					} else {
						email_template_msg = $('#uifm_frm_email_tmpl').val() ? $('#uifm_frm_email_tmpl').val() : '';
					}
				}
				var email_recipient = $('#uifm_frm_email_recipient').val();
				var email_cc = $('#uifm_frm_email_cc').val();
				var email_bcc = $('#uifm_frm_email_bcc').val();
				var email_subject = $('#uifm_frm_email_subject').val();
				var email_replyto = $('#uifm_frm_email_replyto').val();

				this.setUiData2('onsubm', 'mail_template_msg', encodeURIComponent(email_template_msg));
				this.setUiData2('onsubm', 'mail_recipient', email_recipient);
				this.setUiData2('onsubm', 'mail_cc', email_cc);
				this.setUiData2('onsubm', 'mail_bcc', email_bcc);
				this.setUiData2('onsubm', 'mail_subject', email_subject);
				this.setUiData2('onsubm', 'mail_replyto', email_replyto);

				var mail_usr_st = $('#uifm_frm_email_usr_sendst').bootstrapSwitchZgpb('state') ? 1 : 0;
				if (typeof tinymce != 'undefined') {
					editor = tinymce.get('uifm_frm_email_usr_tmpl');
					if (editor && editor instanceof tinymce.Editor) {
						email_template_msg = tinymce.get('uifm_frm_email_usr_tmpl').getContent();
					} else {
						email_template_msg = $('#uifm_frm_email_usr_tmpl').val() ? $('#uifm_frm_email_usr_tmpl').val() : '';
					}
				}
				var email_template_pdf_msg;
				var mail_usr_pdf_st = $('#uifm_frm_email_usr_attachpdfst').bootstrapSwitchZgpb('state') ? 1 : 0;
				if (typeof tinymce != 'undefined') {
					editor = tinymce.get('uifm_frm_email_usr_tmpl_pdf');
					if (editor && editor instanceof tinymce.Editor) {
						email_template_pdf_msg = tinymce.get('uifm_frm_email_usr_tmpl_pdf').getContent();
					} else {
						email_template_pdf_msg = $('#uifm_frm_email_usr_tmpl_pdf').val() ? $('#uifm_frm_email_usr_tmpl_pdf').val() : '';
					}
				}

				var mail_usr_recipient = $('#uifm_frm_email_usr_recipient').val();
				var mail_usr_cc = $('#uifm_frm_email_usr_cc').val();
				var mail_usr_bcc = $('#uifm_frm_email_usr_bcc').val();
				var mail_usr_subject = $('#uifm_frm_email_usr_subject').val();
				var mail_usr_pdf_fn = $('#uifm_frm_email_usr_tmpl_pdf_fn').val();
				var mail_usr_replyto = $('#uifm_frm_email_usr_replyto').val();

				this.setUiData2('onsubm', 'mail_usr_st', mail_usr_st);
				this.setUiData2('onsubm', 'mail_usr_template_msg', encodeURIComponent(email_template_msg));
				this.setUiData2('onsubm', 'mail_usr_pdf_st', mail_usr_pdf_st);
				this.setUiData2('onsubm', 'mail_usr_pdf_template_msg', encodeURIComponent(email_template_pdf_msg));
				this.setUiData2('onsubm', 'mail_usr_pdf_fn', encodeURIComponent(mail_usr_pdf_fn));
				this.setUiData2('onsubm', 'mail_usr_recipient', mail_usr_recipient);
				this.setUiData2('onsubm', 'mail_usr_cc', mail_usr_cc);
				this.setUiData2('onsubm', 'mail_usr_bcc', mail_usr_bcc);
				this.setUiData2('onsubm', 'mail_usr_subject', mail_usr_subject);
				this.setUiData2('onsubm', 'mail_usr_replyto', mail_usr_replyto);

				if (typeof mainrformb['wizard'] == 'undefined') {
					mainrformb['wizard'] = {};
				}

				var tmpTabs = this.getUiData2('steps', 'tab_title');
				var tabCount = this.getUiData2('steps', 'num_tabs');

				var wiz_st = $('#uifm_frm_wiz_st').prop('checked') ? 1 : 0;
				this.setUiData2('steps', 'tab_title', tmpTabs);
				if (wiz_st === 0) {
					tabCount = 1;
				}
				this.setUiData('num_tabs', tabCount);

				this.wizardtab_saveChangesToMdata();
			};

			arguments.callee.records_delreg = function (rec_id) {
				rocketform.showLoader(4, true, true);

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/records/ajax_delete_record',
					data: {
						action: 'rocket_fbuilder_delete_records',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						rec_id: rec_id,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						$("#uiform-container a[data-recid='" + rec_id + "']")
							.closest('tr')
							.fadeOut('slow');

						rocketform.hideLoader();
					}
				});
			};
			arguments.callee.records_loadDataByForm = function (el) {
				var idform = $('#uifm-record-form-cmb').val();
				rocketform.showLoader(1, true, true);
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/records/ajax_load_record_byform',
					data: {
						action: 'rocket_fbuilder_load_records_byform',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						form_id: parseInt(idform),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						$('#uifm-record-results').html(msg);
						$('#table_id').DataTable();
						rocketform.hideLoader();
					}
				});
			};
			arguments.callee.exportForm_loadCodebyForm = function () {
				var idform = $('#uifm-list-form-cmb').val();
				rocketform.showLoader(1, true, true);
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_load_export_form',
					data: {
						action: 'rocket_fbuilder_export_form',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						form_id: parseInt(idform),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						$('#uifm_frm_exportform_code').html(msg);
						rocketform.hideLoader();
					}
				});
			};

			arguments.callee.importForm_onfailExit = function () {
				var re_url = rockfm_vars.uifm_siteurl + '/formbuilder/forms/create_uiform';
				rocketform.redirect_tourl(re_url);
			};
			arguments.callee.importForm_onfailPopup = function () {
				$('#uifm_form_import_modal').sfdc_modal('hide');
				$('#uifm_form_import_onfail .sfdc-modal-title').html($('#uifm_frm_preview_import_title').val());
				$('#uifm_form_import_onfail .sfdc-modal-body').html('<p>' + $('#uifm_frm_preview_import_onfail').val() + '</p>');
				$('#uifm_form_import_onfail').sfdc_modal({
					show: true,
					backdrop: 'static',
					keyboard: false
				});
			};

			arguments.callee.importForm_loadForm = function () {
				try {
					var importcode = $('#uifm_frm_importform_code').val();
					rocketform.showLoader(1, true, true);
					$.ajax({
						type: 'POST',
						url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_load_import_form',
						data: {
							action: 'rocket_fbuilder_import_form',
							page: 'zgfm_form_builder',
							zgfm_security: uiform_vars.ajax_nonce,
							importcode: importcode,
							csrf_field_name: uiform_vars.csrf_field_name
						},
						error: function (xhr, error) {
							rocketform.importForm_onfailPopup();
						},
						success: function (response) {
							if ($.isPlainObject(response)) {
								if (String(response.data.fmb_html_backend)) {
									rocketform.loadFormToEditPanel(response);
									var refreshIntervalId = null;

									var checkIfCoreDataIsSet = function () {
										if (parseInt($('.uiform-main-form').length) != 0) {
											zgfm_back_addon.load_addon();
											clearInterval(refreshIntervalId);
										}
									};
									refreshIntervalId = setInterval(checkIfCoreDataIsSet, 1000);

									rocketform.wizardform_refresh();

									rocketform.loading_panelbox('rocketform-bk-dashboard', 0);
									$('#uifm_form_import_modal').sfdc_modal('hide');
								} else {
									mainrformb = response.data.fmb_data;
									rocketform.refreshPreviewSection_process();
									rocketform.loading_panelbox('rocketform-bk-dashboard', 0);
									$('#uifm_form_import_modal').sfdc_modal('hide');
								}
							} else {
								rocketform.importForm_onfailPopup();
							}
						}
					});
				} catch (ex) {
					rocketform.importForm_onfailPopup();
				}
			};
			arguments.callee.genpdf_inforecord = function (rec_id) {
				try {
					$('body').append("<iframe src='" + uiform_vars.url_admin + 'formbuilder/frontend/pdf_show_record/?uifm_mode=pdf&id=' + rec_id + "' style='display: none;' ></iframe>");
				} catch (ex) {
					console.error(' genpdf_inforecord : ', ex.message);
					var uifm_iframeform = function (url) {
						var object = this;
						object.time = new Date().getTime();
						object.form = $('<form action="' + url + '" target="iframe' + object.time + '" method="post" style="display:none;" id="form' + object.time + '"></form>');

						object.addParameter = function (parameter, value) {
							$("<input type='hidden' />").attr('name', parameter).attr('value', value).appendTo(object.form);
						};

						object.send = function () {
							var iframe = $('<iframe data-time="' + object.time + '" style="display:none;" id="iframe' + object.time + '"></iframe>');
							$('body').append(iframe);
							$('body').append(object.form);
							object.form.submit();
							iframe.load(function () {
								$('#form' + $(this).data('time')).remove();
								$(this).remove();
							});
						};
					};
					var tmpSend = new uifm_iframeform(uiform_vars.url_site + '?uifm_fbuilder_api_handler&action=uifm_fb_api_handler&uifm_action=show_record&uifm_mode=pdf&id=' + rec_id);
					tmpSend.send();
				}
			};

			arguments.callee.importForm_openModal = function () {
				$('#uifm_form_import_modal .sfdc-modal-title').html($('#uifm_frm_preview_import_title').val());
				$('#uifm_form_import_modal .sfdc-modal-body').find('.uifm_frm_importform_code').val('');
				$('#uifm_form_import_modal').sfdc_modal('show');
			};
			arguments.callee.customReport_loadFieldbyForm = function () {
				var idform = $('#uifm-record-form-cmb').val();
				rocketform.showLoader(1, true, true);
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/records/ajax_load_customreport',
					data: {
						action: 'rocket_fbuilder_creport_byform',
						page: 'zgfm_form_builder',
						form_id: parseInt(idform),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						$('#uifm-customreport-results').html(msg);
						rocketform.hideLoader();
					}
				});
			};
			arguments.callee.customReport_saveFields = function () {
				var idform = $('#uifm-record-form-cmb').val();
				var myCheckboxes = new Array();
				$('#uifm-customreport-form input:checked').each(function () {
					myCheckboxes.push($(this).val());
				});
				rocketform.showLoader(3, true, true);
				var elems = $('.uifm-cusreport-order-rec');
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/records/ajax_load_savereport',
					data: {
						action: 'rocket_fbuilder_creport_savefields',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						form_id: parseInt(idform),
						data: myCheckboxes,
						data2: elems.serializeArray(),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						rocketform.hideLoader();
					}
				});
			};
			arguments.callee.saveForm_showModalSuccess = function (idval) {
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/form_success',
					data: {
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						form_id: idval,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					beforeSend: function () {
						$('#uifm_modal_msg .sfdc-modal-body').html(' <i class="sfdc-glyphicon sfdc-glyphicon-refresh gly-spin"></i>');
					},
					success: function (response) {
						var arrJson = (JSON && JSON.parse(response)) || $.parseJSON(response);
						$('#uifm_modal_msg').sfdc_modal('show');
						$('#uifm_modal_msg .sfdc-modal-title').html(arrJson.html_title);
						$('#uifm_modal_msg .sfdc-modal-body').html(arrJson.html);
					}
				});
			};
			arguments.callee.loadFormSaved_regen_closePopUp = function (idval) {
				$('#uifm_modal_alert_regen_msg').sfdc_modal('hide');
			};
			arguments.callee.loadFormSaved_regenerateForm = function () {
				$('#uifm_modal_alert_regen_msg').sfdc_modal({
					backdrop: 'static',
					keyboard: false,
					show: true
				});
				$('#uifm_modal_alert_regen_msg .sfdc-modal-title').html($('#alert_uifm_loading_reg_title').val());
				var content = '<p>' + $('#alert_uifm_loading_reg_cont').val() + '</p>';
				$('#uifm_modal_alert_regen_msg .sfdc-modal-body').html(content);
			};

			arguments.callee.saveform_updateOptionsToFields = function () {
				var numtabs = $('.uiform-steps li');
				var currentTab, currentIndex, currentVal, currentFields;
				var numorder = 1;
				var field_cur;
				var field_type;
				$.each(numtabs, function (index, value) {
					currentTab = $(this).find('a').attr('href');
					if (parseInt($(currentTab).length) != 0) {
						currentIndex = $(this).find('a').attr('data-tab-nro');

						currentFields = $(currentTab).find('.uiform-field');
						if (parseInt(currentFields.length) != 0) {
							$.each(currentFields, function (index2, value2) {
								field_cur = $(this).attr('id');

								field_type = $(this).attr('data-typefield');
								switch (parseInt(field_type)) {
									case 6:
									case 7:
									case 8:
									case 9:
									case 10:
									case 11:
									case 12:
									case 13:
									case 15:
									case 16:
									case 17:
									case 18:
									case 21:
									case 22:
									case 23:
									case 24:
									case 25:
									case 26:
									case 28:
									case 29:
									case 30:
									case 39:
									case 40:
									case 41:
									case 42:
										rocketform.setUiData4('steps_src', currentIndex, field_cur, 'order_frm', numorder);
										if (parseInt(rocketform.getUiData4('steps_src', currentIndex, field_cur, 'order_rec')) === 0) {
											rocketform.setUiData4('steps_src', currentIndex, field_cur, 'order_rec', numorder);
										}
										break;
									case 19:
									case 20:
									case 27:
										rocketform.setUiData4('steps_src', currentIndex, field_cur, 'order_frm', numorder);
										break;
								}
								numorder++;
							});
						}
					} else {
					}
				});
			};

			arguments.callee.saveForm = function () {
				rocketform.loading_panelbox2(1);

				rocketform.showLoader(3, true, false);

				if (parseInt($('#uifm_frm_main_id').val()) === 0) {
					$.ajax({
						type: 'POST',
						url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_save_newform',
						data: {
							action: 'rocket_fbuilder_save_newform',
							page: 'zgfm_form_builder',
							zgfm_security: uiform_vars.ajax_nonce,
							uifm_frm_main_title: $('#uifm_frm_main_title').val(),
							csrf_field_name: uiform_vars.csrf_field_name
						},

						success: function (msg) {
							if (parseInt(msg.id) > 0) {
								$('#uifm_frm_main_id').val(msg.id);
								$('#uifm_frm_main_isnewform').val('1');
								rocketform.saveForm();
							} else {
								alert('Error');
							}
						}
					});

					return;
				}


				rocketform.previewfield_removeAllPopovers();

				this.saveform_cleanForm();

				this.saveform_updateOptionsToFields();

				if ($(document).find('.uifm-highlight-edited')) {
					$(document).find('.uifm-highlight-edited').removeClass('uifm-highlight-edited');
				}
				$('.uiform-main-form .uiform-fields-qopt-select input:checked').prop('checked', false);
				$('.uiform-main-form .uiform-fields-qopt-select input:checked').closest('.uiform-fields-quick-options').removeCss('display');
				this.closeSettingTab();
				rocketform.showLoader(3, true, true);
				this.saveTabContent();

				rocketform.setUiData('app_ver', uiform_vars.app_version);
				var tmp_frm = mainrformb;
				if (parseInt($('.uiform-main-form').find('.uifm-input-ratingstar').length) != 0) {
					var rockfm_tmp_rs = $('.uiform-main-form').find('.uifm-input-ratingstar');
					rockfm_tmp_rs.each(function (i) {
						$(this).rating('destroy');
					});
				}

				var html_backend = $('.uiform-preview-base').html();

				if (parseInt($('.uiform-main-form').find('.uifm-input-ratingstar').length) != 0) {
					$('.uiform-main-form')
						.find('.uifm-input-ratingstar')
						.each(function (i) {
							rocketform.input9settings_updateField($(this).closest('.uiform-field'), 'input9');
						});
				}

				var tmp_addon_data = zgfm_back_addon.do_action('getData_beforeSubmitForm', null);
				var editor;

				var uifm_frm_rec_tpl_html;
				var uifm_frm_rec_tpl_st = $('#uifm_frm_record_tpl_enable').bootstrapSwitchZgpb('state') ? 1 : 0;
				if (typeof tinymce != 'undefined') {
					editor = tinymce.get('uifm_frm_record_tpl_content');
					if (editor && editor instanceof tinymce.Editor) {
						uifm_frm_rec_tpl_html = tinymce.get('uifm_frm_record_tpl_content').getContent();
					} else {
						uifm_frm_rec_tpl_html = $('#uifm_frm_record_tpl_content').val() ? $('#uifm_frm_record_tpl_content').val() : '';
					}
				}

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_save_form',
					data: {
						action: 'rocket_fbuilder_save_form',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						uifm_frm_main_title: $('#uifm_frm_main_title').val(),
						uifm_frm_main_id: $('#uifm_frm_main_id').val(),
						uifm_frm_rec_tpl_st: uifm_frm_rec_tpl_st,
						uifm_frm_rec_tpl_html: encodeURIComponent(uifm_frm_rec_tpl_html),
						form_data: encodeURIComponent(JSON.stringify(tmp_frm)),
						addon_data: encodeURIComponent(JSON.stringify(tmp_addon_data)),
						form_inputs: $('form#zgfm_edit_panel').serialize(),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						if (String(msg.status) === 'failed') {
							rocketform.fields_showModalOptions();
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-header-inner').html(msg.modal_header);
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.sfdc-modal-body').html(msg.Message);
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-footer-wrap').html(msg.modal_footer);
						}

						rocketform.loading_panelbox2(0);
						rocketform.showLoader(5, false, true);

						if (parseInt(msg.id) > 0) {
							if (parseInt($('#uifm_frm_main_isnewform').val()) === 1) {
								rocketform.saveForm_showModalSuccess(msg.id);
							}
							$('#uifm_frm_main_id').val(msg.id);
							$('#uifm_frm_main_isnewform').val('0');
						}

					}
				});
			};
			arguments.callee.loadForm_tab_subm_msgbg1 = function () {
				$('#uifm_frm_subm_bgst_typ1_handle').show();
				$('#uifm_frm_subm_bgst_typ2_handle').hide();
			};
			arguments.callee.loadForm_tab_subm_msgbg2 = function () {
				$('#uifm_frm_subm_bgst_typ1_handle').hide();
				$('#uifm_frm_subm_bgst_typ2_handle').show();
			};
			arguments.callee.loadForm_tab_subm = function () {
				$('#uifm_frm_subm_bgst_typ1_handle').hide();
				$('#uifm_frm_subm_bgst_typ2_handle').hide();
				var valinput = $('#uifm_frm_subm_bgst_handle').find('input').val();
				if (parseInt(valinput) === 1) {
					$('#uifm_frm_subm_bgst_typ1_handle').show();
					$('#uifm_frm_subm_bgst_typ2_handle').hide();
				} else if (parseInt(valinput) === 2) {
					$('#uifm_frm_subm_bgst_typ1_handle').hide();
					$('#uifm_frm_subm_bgst_typ2_handle').show();
				} else {
					$('#uifm_frm_subm_bgst_typ1_handle').hide();
					$('#uifm_frm_subm_bgst_typ2_handle').hide();
				}
			};

			arguments.callee.loadForm_tab_skin_delbgimg = function () {
				$('#uifm_frm_skin_bg_srcimg_wrap').html('');
				$('#uifm_frm_skin_bg_imgurl').val('');
				rocketform.loadForm_tab_skin_updateBG();
			};
			arguments.callee.loadForm_tab_skin_updateBG = function () {
				var skin_bg_imgurl = $('#uifm_frm_skin_bg_imgurl').val();
				this.setUiData3('skin', 'form_background', 'image', skin_bg_imgurl);
				var obj_field = $('.uiform-preview-base');
				if (obj_field) {
					rocketform.setDataOptToPrevForm(obj_field, 'skin', 'form_background-image', '');
				}
			};

			arguments.callee.loadForm_tab_inp18_updateBG = function () {
			};
			arguments.callee.wizardtab_addSubmitButton = function () {
				var current_content = $('.uiform-steps .uifm-current').find('a').attr('href');
				var obj = $(current_content);
				if (parseInt(obj.find('.uiform-wizardbtn').length) > 0) {
				} else {
					var el_field = $('.uiform-enable-fieldset').find('a.uiform-wizardbtn');
					rocketform.mainfields_addFieldToForm(el_field, 39);
					setTimeout(function () {
						$('.sfdc-nav-tabs a[href="#uiform-build-form-tab"]').sfdc_tab('show');
					}, 2000);
				}
			};
			arguments.callee.wizardtab_enableStatus = function () {
				var wiz_st = $('#uifm_frm_wiz_st').prop('checked') ? 1 : 0;
				if (wiz_st === 1) {
					$('.uiform-step-list').show();
					this.wizardtab_gotoFirstPosition();

					$('.uiform_frm_wiz_main_content').show();
				} else {
					$('.uiform-step-list').hide();
					$('.uiform_frm_wiz_main_content').hide();
					this.wizardtab_gotoFirstPosition();
				}
				rocketform.setUiData2('wizard', 'enable_st', wiz_st);
			};
			arguments.callee.wizardtab_changeTabTitle = function (nro) {
				var tabobj = $(".uiform-step-list li > a[data-tab-nro='" + nro + "']").find('.uifm-title');
				var tab_title = $('#uifm_frm_skin_tab' + nro + '_title').val() ? $('#uifm_frm_skin_tab' + nro + '_title').val() : 'Tab title';
				tabobj.html(tab_title);
				rocketform.setUiData4('steps', 'tab_title', nro, 'title', tab_title);
			};

			arguments.callee.saveform_cleanForm2 = function () {
				var tmp_arr;
				var tmp_len;
				var tmp_i;
				var tmp_new_arr;

				tmp_arr = mainrformb['steps_src'];
				tmp_new_arr = {};
				tmp_len = tmp_arr.length;
				for (tmp_i = 0; tmp_i < tmp_len; tmp_i++) {
					if ($.isArray(tmp_arr[tmp_i])) {
						tmp_new_arr[tmp_i] = {};
					} else {
						tmp_new_arr[tmp_i] = tmp_arr[tmp_i];
					}
				}

				mainrformb['steps_src'] = tmp_new_arr;
			};
			arguments.callee.saveform_cleanForm = function () {
				try {
					var numtabs = $('.uiform-steps li');
					var currentTab, currentIndex, currentVal, currentFields;
					$.each(numtabs, function (index, value) {
						currentTab = $(this).find('a').attr('href');
						if (parseInt($(currentTab).length) != 0) {
							currentIndex = $(this).find('a').attr('data-tab-nro');

							currentFields = $(currentTab).find('.uiform-field');
							if (parseInt(currentFields.length) != 0) {
								$.each(currentFields, function (index2, value2) {
									try {
										if (typeof mainrformb['steps_src'][currentIndex][$(this).attr('id')] == 'undefined') {
											$(this).remove();
											rocketform.delUiData3('steps_src', currentIndex, $(this).attr('id'));
										}else{

											let tmp_field=mainrformb['steps_src'][currentIndex][$(this).attr('id')];

											if(tmp_field.hasOwnProperty('clogic')){
												let tmp_clist=tmp_field['clogic']['list'];
												if ( tmp_clist && tmp_clist.length>0) {
													var tmp_new_clist=[];
													$.each(tmp_clist, function( clindex, clvalue ) {
												  		if($("#" + clvalue['field_fire']).length == 0) {
														}else{
															tmp_new_clist.push(tmp_clist[clindex]);
														}
													});

													if ( parseInt(tmp_new_clist.length) === 0) {

														mainrformb['steps_src'][currentIndex][$(this).attr('id')]['clogic']['show_st']='0';														
													}

													mainrformb['steps_src'][currentIndex][$(this).attr('id')]['clogic']['list']=tmp_new_clist;
												}else{
													mainrformb['steps_src'][currentIndex][$(this).attr('id')]['clogic']['show_st']='0';
												}
											}

 										}
									} catch (ex) {
										$(this).remove();
										try {
											rocketform.delUiData3('steps_src', currentIndex, $(this).attr('id'));
										} catch (ex) {}
									}
								});
							} else {
							}
						} else {
							$(this).remove();
							$(currentTab).remove();
						}
					});

					var tmp_arr;
					var tmp_len;
					var tmp_i;

					if (
						parseInt(
							$.map(mainrformb['steps_src'], function (n, i) {
								return i;
							}).length
						) != 0
					) {
						$.each(mainrformb['steps_src'], function (index3, value3) {
							$.each(value3, function (index4, value4) {
								if (parseInt($('#' + index4).length) != 0) {
									switch (parseInt(value4['type'])) {
										case 8:
										case 9:
										case 10:
										case 11:

											tmp_arr = mainrformb['steps_src'][index3][index4]['input2']['options'];
											var tmp_len = tmp_arr.length,
												tmp_i;
											for (tmp_i = 0; tmp_i < tmp_len; tmp_i++) tmp_arr[tmp_i] && tmp_arr.push(tmp_arr[tmp_i]);
											if ($.isArray(tmp_arr)) {
												tmp_arr.splice(0, tmp_len);
												mainrformb['steps_src'][index3][index4]['input2']['options'] = tmp_arr;
											}

											break;
									}
								} else {
									rocketform.delUiData3('steps_src', index3, index4);
								}
							});
						});
					}

					if (
						parseInt(
							$.map(mainrformb['steps_src'], function (n, i) {
								return i;
							}).length
						) != 0
					) {
						$.each(mainrformb['steps_src'], function (index3, value3) {
							$.each(value3, function (index4, value4) {
								if (parseInt($('#' + index4).length) === 0) {
									switch (parseInt(value4['type'])) {
										case 1:
										case 2:
										case 3:
										case 4:
										case 5:
											break;
										default:
											rocketform.delUiData3('steps_src', index3, index4);
											break;
									}
								}
							});
						});
					}


					var tmp_arr = rocketform.getUiData('steps_src');
					var tmp_arr_new = {};
					var tmp_len = 0;
					$.each(tmp_arr, function (key, value) {
						tmp_len++;
						if (tmp_arr[key] && !$.isEmptyObject(tmp_arr[key])) {
							tmp_arr_new[key] = value;
						}
					});

					rocketform.setUiData('steps_src', tmp_arr_new);

					var tmpnum_list = $('#uifm_frm_skin_tabs_box .uifm_frm_skin_tab_content');
					var tmpTabs = {};
					var tabCount = 0;
					tmpnum_list.each(function (i) {
						var tmpTab_inner_num = $(this).attr('data-tab-nro');
						var tmpTab_inner = {};
						tmpTab_inner.title = $(this).find('.uifm_frm_skin_tab_title_evt').val();

						if (mainrformb['steps_src'].hasOwnProperty(parseInt(tmpTab_inner_num))) {
							if (tmpTab_inner_num) {
								tmpTabs[tmpTab_inner_num] = tmpTab_inner;
							}
							tabCount++;
						} else {
							delete mainrformb['steps']['tab_title'][parseInt(tmpTab_inner_num)];

							var tmp_arr_2 = rocketform.getUiData2('steps', 'tab_title');
							var tmp_arr_new_2 = {};
							var tmp_len_2 = 0;
							$.each(tmp_arr_2, function (key, value) {
								tmp_len_2++;
								if (tmp_arr_2[key] && !$.isEmptyObject(tmp_arr_2[key])) {
									tmp_arr_new_2[key] = value;
								}
							});
							rocketform.setUiData2('steps', 'tab_title', tmp_arr_new_2);

							$('.uiform-step-list .uiform-steps li a[data-tab-nro="' + tmpTab_inner_num + '"]')
								.parent()
								.remove();

							$(this).parent().remove();
						}
					});
					this.setUiData2('steps', 'num_tabs', tabCount);

					$('.uiform-main-form').find('.uiform-draggable-field').remove();
				} catch (ex) {
					console.error('saveform_cleanForm : ', ex.message);
				}
			};
			arguments.callee.wizardtab_cleanTabs = function () {
				$('#uifm_frm_skin_tabs_box').html('');
				var numtabs = $('.uiform-steps li');
				var currentTab, currentIndex, currentVal, currentFields;
				$.each(numtabs, function (index, value) {
					currentTab = $(this).find('a').attr('href');
					if (parseInt($(currentTab).length) != 0) {
						currentIndex = $(this).find('a').attr('data-tab-nro');
						currentVal = $(this).find('a span.uifm-title').text();
						rocketform.wizardtab_addTabController(currentIndex);
						$('#uifm_frm_skin_tabs_box')
							.find('#uifm_frm_skin_tab' + currentIndex + '_title')
							.val(currentVal);
						currentFields = $(currentTab).find('.uiform-field');
						if (parseInt(currentFields.length) != 0) {
							$.each(currentFields, function (index2, value2) {
								try {
									if (typeof mainrformb['steps_src'][currentIndex][$(this).attr('id')] == 'undefined') {
										$(this).remove();
										rocketform.delUiData3('steps_src', currentIndex, $(this).attr('id'));
									}
								} catch (ex) {
									$(this).remove();
									try {
										rocketform.delUiData3('steps_src', currentIndex, $(this).attr('id'));
									} catch (ex) {}
								}
							});
						}
					} else {
						$(this).remove();
						$(currentTab).remove();
					}
				});


				if (
					parseInt(
						$.map(mainrformb['steps_src'], function (n, i) {
							return i;
						}).length
					) != 0
				) {
					$.each(mainrformb['steps_src'], function (index3, value3) {
						$.each(value3, function (index4, value4) {
							if (parseInt($('#' + index4).length) != 0) {
							} else {
								rocketform.delUiData3('steps_src', index3, index4);
							}
						});
					});
				}
			};
			arguments.callee.wizardtab_addNewTab = function () {
				var num = $('.uiform-steps li').length;
				var newNum = new Number(num);
				var wiz_theme_typ = parseInt(this.getUiData2('wizard', 'theme_type'));
				var stringvar;
				switch (wiz_theme_typ) {
					case 0:
					case 1:
						stringvar = '<li class="uifm-current">';
						stringvar += '<a data-tab-nro="' + newNum + '" href="#uifm-step-tab-' + newNum + '">';
						stringvar += '<span class="uifm-number">' + (newNum + 1) + '</span>';
						stringvar += '<span class="uifm-title">Tab title' + (newNum + 1) + '</span>';
						stringvar += '</a>';
						stringvar += '</li>';

						$('.uiform-steps').find('.uifm-current').removeClass('uifm-current').addClass('uifm-disabled');
						$('.uiform-steps').append(stringvar);
						break;
				}
				rocketform.addIndexUiData2('steps', 'tab_title', parseInt(newNum));
				rocketform.setUiData3('steps', 'tab_title', parseInt(newNum), { title: 'Tab title ' + newNum });

				var stringvar2 = '<div data-uifm-step="' + newNum + '" id="uifm-step-tab-' + newNum + '" class="uiform-step-pane">';
				stringvar2 += '<div id="" class="uiform-items-container uiform-tab-container"></div>';
				stringvar2 += '</div>';
				$('.uiform-step-content').append(stringvar2);
				$('.uiform-step-pane').hide();
				$('#uifm-step-tab-' + newNum).show();

				$('ul.uiform-steps li').off('click');
				this.wizardtab_tabManageEvt();
				rocketform.wizardtab_addTabController(newNum);
				enableSortableItems();
			};
			arguments.callee.wizardtab_addTabController = function (numvar) {
				try {
					var tmp_tmpl = wp.template('zgfm-frm-wiz-templates');
					var tmpTpl2 = $('<div></div>');
					tmpTpl2.append(tmp_tmpl());
					tmpTpl2.find('.uifm_frm_skin_tab_content').attr('data-tab-nro', numvar);
					tmpTpl2.find('.uifm_frm_skin_tab_title_evt').attr('id', 'uifm_frm_skin_tab' + numvar + '_title');
					tmpTpl2.find('.uifm_frm_skin_tab_title_evt').val('Tab title ' + (numvar + 1));
					tmpTpl2
						.find('.uifm_frm_skin_tab_title_evt')
						.parent()
						.find('label span')
						.html(numvar + 1);

					$('#uifm_frm_skin_tabs_box').append(tmpTpl2);
				} catch (ex) {
					console.error('wizardtab_addTabController : ', ex.message);
				}
			};
			arguments.callee.wizardtab_gotoFirstPosition = function () {
				$('.uiform-steps').find('.uifm-current').removeClass('uifm-current').addClass('uifm-disabled');
				$('.uiform-steps li:first').removeClass('uifm-disabled').addClass('uifm-current');
				$('.uiform-step-content .uiform-step-pane').hide();
				$('.uiform-step-content .uiform-step-pane:first').show();
			};
			arguments.callee.wizardtab_deleteTab = function (element) {
				var el = $(element);
				var el_num = el.closest('.uifm_frm_skin_tab_content').data('tab-nro');
				if (parseInt(el_num) != 0) {
					var tabobj = $(".uiform-step-list li > a[data-tab-nro='" + el_num + "']");

					tabobj.parent().remove();
					$('#uifm-step-tab-' + el_num).remove();
					this.wizardtab_gotoFirstPosition();
					el.closest('.uifm_frm_skin_tab_content').remove();

					rocketform.spliceUiData3('steps', 'tab_title', parseInt(el_num));
					rocketform.spliceUiData3('steps', 'tab_cont', parseInt(el_num));
					rocketform.spliceUiData2('steps_src', parseInt(el_num));
					var tmp_num_tabs = $('.uiform-step-list li > a').length;
					rocketform.setUiData('num_tabs', parseInt(tmp_num_tabs));

					$.each($('.uiform-step-list li > a'), function (index, value) {
						$(this).attr('data-tab-nro', index);
						$(this).attr('href', '#uifm-step-tab-' + index);
					});
					$.each($('.uiform-step-content > div'), function (index, value) {
						$(this).attr('id', 'uifm-step-tab-' + index);
						$(this).attr('data-uifm-step', index);
					});

					rocketform.wizardtab_refreshTabSettings();
				}
			};
			arguments.callee.wizardtab_changeTheme = function (type) {
				this.setUiData2('wizard', 'theme_type', type);
				this.wizardtab_showOptions();
				rocketform.wizardtab_setDataToTabSettings();
				this.wizardtab_changeThemeOnPreview();
			};
			arguments.callee.wizardtab_changeThemeOnPreview = function () {
				var wiz_theme_typ = parseInt(this.getUiData2('wizard', 'theme_type'));
				this.wizardtab_gotoFirstPosition();
				$('ul.uiform-steps li').off('click');
				$('.uiform-step-list').html('');
				$('.uiform-step-list').attr('class', 'uiform-step-list');
				var elm_li = this.getUiData2('steps', 'tab_title');
				var string_html = '';
				var count = 0;
				switch (wiz_theme_typ) {
					case 0:
						$('.uiform-step-list').addClass('uiform-wiztheme0');
						string_html += '';
						string_html += '<ul class="uiform-steps">';

						$.each(elm_li, function (index, value) {
							if (count === 0) {
								string_html += '<li class="uifm-current">';
							} else {
								string_html += '<li class="uifm-disabled">';
							}
							string_html += '<a href="#uifm-step-tab-' + index + '" data-tab-nro="' + index + '">';
							string_html += '<span class="uifm-number">' + (parseInt(index) + 1) + '</span>';
							string_html += '<span class="uifm-title">' + value.title + '</span>';
							string_html += '</a>';
							string_html += '</li>';
							count++;
						});
						string_html += '</ul>';
						$('.uiform-step-list').html(string_html);
						break;
					case 1:
						$('.uiform-step-list').addClass('uiform-wiztheme1');
						string_html += '';
						string_html += '<ul class="uiform-steps">';

						$.each(elm_li, function (index, value) {
							if (count === 0) {
								string_html += '<li class="uifm-current">';
							} else {
								string_html += '<li class="uifm-disabled">';
							}
							string_html += '<a href="#uifm-step-tab-' + index + '" data-tab-nro="' + index + '">';
							string_html += '<span class="uifm-number">' + (parseInt(index) + 1) + '</span>';
							string_html += '<span class="uifm-title">' + value.title + '</span>';
							string_html += '</a>';
							string_html += '</li>';
							count++;
						});
						string_html += '</ul>';
						$('.uiform-step-list').html(string_html);
						break;
				}

				this.wizardtab_tabManageEvt();
			};
			arguments.callee.wizardtab_showOptions = function () {
				try {
					var clvars;
					clvars = [
						'#uifm_frm_wiz_tab_cont_wrap',
						'#uifm_frm_wiz_tab_active_wrap',
						'#uifm_frm_wiz_tab_inactive_wrap',
						'#uifm_frm_wiz_tab_active_bgcolor_wrap',
						'#uifm_frm_wiz_tab_active_txtcolor_wrap',
						'#uifm_frm_wiz_tab_active_numtxtcolor_wrap',
						'#uifm_frm_wiz_tab_active_bg_numtxt_wrap',
						'#uifm_frm_wiz_tab_inactive_bgcolor_wrap',
						'#uifm_frm_wiz_tab_inactive_txtcolor_wrap',
						'#uifm_frm_wiz_tab_inactive_numtxtcolor_wrap',
						'#uifm_frm_wiz_tab_cont_bgcolor_wrap',
						'#uifm_frm_wiz_tab_cont_borcol_wrap',
						'#uifm_frm_wiz_tab_done_wrap',
						'#uifm_frm_wiz_tab_done_bgcolor_wrap',
						'#uifm_frm_wiz_tab_done_txtcolor_wrap',
						'#uifm_frm_wiz_tab_done_numtxtcolor_wrap'
					];
					$.each(clvars, function () {
						$(String(this)).addClass('uifm-hide');
					});

					var wiz_theme_typ = parseInt(this.getUiData2('wizard', 'theme_type'));

					switch (wiz_theme_typ) {
						case 0:
							clvars = [
								'#uifm_frm_wiz_tab_cont_wrap',
								'#uifm_frm_wiz_tab_active_wrap',
								'#uifm_frm_wiz_tab_inactive_wrap',
								'#uifm_frm_wiz_tab_active_bgcolor_wrap',
								'#uifm_frm_wiz_tab_active_txtcolor_wrap',
								'#uifm_frm_wiz_tab_active_numtxtcolor_wrap',
								'#uifm_frm_wiz_tab_inactive_bgcolor_wrap',
								'#uifm_frm_wiz_tab_inactive_txtcolor_wrap',
								'#uifm_frm_wiz_tab_inactive_numtxtcolor_wrap',
								'#uifm_frm_wiz_tab_cont_bgcolor_wrap',
								'#uifm_frm_wiz_tab_cont_borcol_wrap',
								'#uifm_frm_wiz_tab_done_wrap',
								'#uifm_frm_wiz_tab_done_bgcolor_wrap',
								'#uifm_frm_wiz_tab_done_txtcolor_wrap',
								'#uifm_frm_wiz_tab_done_numtxtcolor_wrap'
							];
							$.each(clvars, function () {
								$(String(this)).removeClass('uifm-hide');
							});
							break;
						case 1:
							clvars = [
								'#uifm_frm_wiz_tab_active_wrap',
								'#uifm_frm_wiz_tab_active_bgcolor_wrap',
								'#uifm_frm_wiz_tab_active_txtcolor_wrap',
								'#uifm_frm_wiz_tab_active_numtxtcolor_wrap',
								'#uifm_frm_wiz_tab_active_bg_numtxt_wrap',
								'#uifm_frm_wiz_tab_inactive_wrap',
								'#uifm_frm_wiz_tab_inactive_bgcolor_wrap',
								'#uifm_frm_wiz_tab_inactive_txtcolor_wrap'
							];
							$.each(clvars, function () {
								$(String(this)).removeClass('uifm-hide');
							});
							break;
					}
				} catch (ex) {
					console.error('wizardtab_showOptions : ', ex.message);
				}
			};
			arguments.callee.wizardtab_setDataToTabSettings = function () {
				try {
					var type = parseInt(this.getUiData2('wizard', 'theme_type'));
					if (type) {
						$('#uifm_frm_wiz_theme_typ').val(type);
					}
					switch (type) {
						case 0:
							var wiz_active_bgcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_cur_bgcolor');
							if (wiz_active_bgcol) {
								$('#uifm_frm_wiz_tab_active_bgcolor').parent().colorpicker('setValue', wiz_active_bgcol);
								$('#uifm_frm_wiz_tab_active_bgcolor').val(wiz_active_bgcol);
							}
							var wiz_active_txtcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_cur_txtcolor');
							if (wiz_active_txtcol) {
								$('#uifm_frm_wiz_tab_active_txtcolor').parent().colorpicker('setValue', wiz_active_txtcol);
								$('#uifm_frm_wiz_tab_active_txtcolor').val(wiz_active_txtcol);
							}
							var wiz_active_numtxtcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_cur_numtxtcolor');
							if (wiz_active_numtxtcol) {
								$('#uifm_frm_wiz_tab_active_numtxtcolor').parent().colorpicker('setValue', wiz_active_numtxtcol);
								$('#uifm_frm_wiz_tab_active_numtxtcolor').val(wiz_active_numtxtcol);
							}

							var wiz_inactive_bgcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_inac_bgcolor');
							if (wiz_inactive_bgcol) {
								$('#uifm_frm_wiz_tab_inactive_bgcolor').parent().colorpicker('setValue', wiz_inactive_bgcol);
								$('#uifm_frm_wiz_tab_inactive_bgcolor').val(wiz_inactive_bgcol);
							}
							var wiz_inactive_txtcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_inac_txtcolor');
							if (wiz_inactive_txtcol) {
								$('#uifm_frm_wiz_tab_inactive_txtcolor').parent().colorpicker('setValue', wiz_inactive_txtcol);
								$('#uifm_frm_wiz_tab_inactive_txtcolor').val(wiz_inactive_txtcol);
							}
							var wiz_inactive_numtxtcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_inac_numtxtcolor');
							if (wiz_inactive_numtxtcol) {
								$('#uifm_frm_wiz_tab_inactive_numtxtcolor').parent().colorpicker('setValue', wiz_inactive_numtxtcol);
								$('#uifm_frm_wiz_tab_inactive_numtxtcolor').val(wiz_inactive_numtxtcol);
							}
							var wiz_done_bgcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_done_bgcolor');
							if (wiz_done_bgcol) {
								$('#uifm_frm_wiz_tab_done_bgcolor').parent().colorpicker('setValue', wiz_done_bgcol);
								$('#uifm_frm_wiz_tab_done_bgcolor').val(wiz_done_bgcol);
							}
							var wiz_done_txtcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_done_txtcolor');
							if (wiz_done_txtcol) {
								$('#uifm_frm_wiz_tab_done_txtcolor').parent().colorpicker('setValue', wiz_done_txtcol);
								$('#uifm_frm_wiz_tab_done_txtcolor').val(wiz_done_txtcol);
							}
							var wiz_done_numtxtcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_done_numtxtcolor');
							if (wiz_done_numtxtcol) {
								$('#uifm_frm_wiz_tab_done_numtxtcolor').parent().colorpicker('setValue', wiz_done_numtxtcol);
								$('#uifm_frm_wiz_tab_done_numtxtcolor').val(wiz_done_numtxtcol);
							}

							var wiz_cont_bgcolor = this.getUiData4('wizard', 'theme', type, 'skin_tab_cont_bgcolor');
							if (wiz_cont_bgcolor) {
								$('#uifm_frm_wiz_tab_cont_bgcolor').parent().colorpicker('setValue', wiz_cont_bgcolor);
								$('#uifm_frm_wiz_tab_cont_bgcolor').val(wiz_cont_bgcolor);
							}
							var wiz_cont_borcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_cont_borcol');
							if (wiz_cont_borcol) {
								$('#uifm_frm_wiz_tab_cont_borcol').parent().colorpicker('setValue', wiz_cont_borcol);
								$('#uifm_frm_wiz_tab_cont_borcol').val(wiz_cont_borcol);
							}

							break;
						case 1:
							var wiz_active_bgcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_cur_bgcolor');
							if (wiz_active_bgcol) {
								$('#uifm_frm_wiz_tab_active_bgcolor').parent().colorpicker('setValue', wiz_active_bgcol);
								$('#uifm_frm_wiz_tab_active_bgcolor').val(wiz_active_bgcol);
							}
							var wiz_active_txtcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_cur_txtcolor');
							if (wiz_active_txtcol) {
								$('#uifm_frm_wiz_tab_active_txtcolor').parent().colorpicker('setValue', wiz_active_txtcol);
								$('#uifm_frm_wiz_tab_active_txtcolor').val(wiz_active_txtcol);
							}
							var wiz_active_numtxtcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_cur_numtxtcolor');
							if (wiz_active_numtxtcol) {
								$('#uifm_frm_wiz_tab_active_numtxtcolor').parent().colorpicker('setValue', wiz_active_numtxtcol);
								$('#uifm_frm_wiz_tab_active_numtxtcolor').val(wiz_active_numtxtcol);
							}
							var wiz_active_bg_numtxt = this.getUiData4('wizard', 'theme', type, 'skin_tab_cur_bg_numtxt');
							if (wiz_active_bg_numtxt) {
								$('#uifm_frm_wiz_tab_active_bg_numtxt').parent().colorpicker('setValue', wiz_active_bg_numtxt);
								$('#uifm_frm_wiz_tab_active_bg_numtxt').val(wiz_active_bg_numtxt);
							}

							var wiz_inactive_bgcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_inac_bgcolor');
							if (wiz_inactive_bgcol) {
								$('#uifm_frm_wiz_tab_inactive_bgcolor').parent().colorpicker('setValue', wiz_inactive_bgcol);
								$('#uifm_frm_wiz_tab_inactive_bgcolor').val(wiz_inactive_bgcol);
							}
							var wiz_inactive_txtcol = this.getUiData4('wizard', 'theme', type, 'skin_tab_inac_txtcolor');
							if (wiz_inactive_txtcol) {
								$('#uifm_frm_wiz_tab_inactive_txtcolor').parent().colorpicker('setValue', wiz_inactive_txtcol);
								$('#uifm_frm_wiz_tab_inactive_txtcolor').val(wiz_inactive_txtcol);
							}

							break;
					}
				} catch (ex) {
					console.error(' wizardtab_setDataToTabSettings : ', ex.message);
				}
			};
			arguments.callee.wizardtab_refreshTabSettings = function () {
				try {
					var wiz_bg_st = parseInt(this.getUiData2('wizard', 'enable_st')) === 1 ? true : false;
					$('#uifm_frm_wiz_st').bootstrapSwitchZgpb('state', wiz_bg_st);

					var wiz_tab_list = this.getUiData2('steps', 'tab_title');
					$('#uifm_frm_skin_tabs_box').html('');

					$.each(wiz_tab_list, function (index, value) {
						rocketform.wizardtab_addTabController(index);
						$('#uifm_frm_skin_tab' + index + '_title').val(value.title);
					});

					rocketform.wizardtab_setDataToTabSettings();
				} catch (ex) {
					console.error(' wizardtab_refreshTabSettings : ', ex.message);
				}
			};
			arguments.callee.wizardtab_refreshPreview = function () {
				try {
					var wiz_theme_typ = parseInt(this.getUiData2('wizard', 'theme_type'));
					var border_focus_str;
					var f_id = 'uifm_frm_wiz_css_head';

					switch (wiz_theme_typ) {
						case 0:
							var wiz_active_bgcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_bgcolor');

							var wiz_active_txtcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_txtcolor');

							var wiz_active_numtxtcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_numtxtcolor');

							var wiz_inactive_bgcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_bgcolor');

							var wiz_inactive_txtcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_txtcolor');

							var wiz_inactive_numtxtcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_numtxtcolor');

							var wiz_done_bgcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_done_bgcolor');

							var wiz_done_txtcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_done_txtcolor');

							var wiz_done_numtxtcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_done_numtxtcolor');

							var wiz_cont_bgcolor = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cont_bgcolor');

							var wiz_cont_borcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cont_borcol');

							$('#' + f_id + '_tab').remove();
							border_focus_str = '<style type="text/css" id="' + f_id + '_tab">';
							border_focus_str += '.uiform-main-form .uiform-wiztheme0 .uiform-steps li.uifm-disabled a,';
							border_focus_str += '.uiform-main-form .uiform-wiztheme0 .uiform-steps li.uifm-disabled a:hover,';
							border_focus_str += '.uiform-main-form .uiform-wiztheme0 .uiform-steps li.uifm-disabled a:active {';
							border_focus_str += 'background:' + wiz_inactive_bgcol + '!important;';
							border_focus_str += 'color:' + wiz_inactive_txtcol + ';';
							border_focus_str += '} ';

							border_focus_str += '.uiform-wiztheme0 .uiform-steps .uifm-number {';
							border_focus_str += 'background-color: ' + wiz_inactive_bgcol + '!important;';
							border_focus_str += 'color:' + wiz_active_numtxtcol + ';';
							border_focus_str += '}';

							border_focus_str += '.uiform-wiztheme0 .uiform-steps .uifm-number:after {';
							border_focus_str += ' border-left:14px solid ' + wiz_active_bgcol + '!important;';
							border_focus_str += '}';

							border_focus_str += '.uiform-wiztheme0 .uiform-steps .uifm-current .uifm-number:before {';
							border_focus_str += 'border-left-color: ' + wiz_active_bgcol + '!important;';
							border_focus_str += '}';

							border_focus_str += '.uiform-wiztheme0 .uiform-steps .uifm-current .uifm-number:after {';
							border_focus_str += 'border-left-color: ' + wiz_active_bgcol + '!important;';
							border_focus_str += '}';

							border_focus_str += '.uiform-wiztheme0 .uiform-steps .uifm-disabled .uifm-number {';
							border_focus_str += 'background-color: ' + wiz_active_bgcol + '!important;';
							border_focus_str += 'color:' + wiz_inactive_numtxtcol + ';';
							border_focus_str += '}';
							border_focus_str += '.uiform-main-form .uiform-wiztheme0 .uiform-steps li.uifm-current a,';
							border_focus_str += '.uiform-main-form .uiform-wiztheme0 .uiform-steps li.uifm-current a:hover,';
							border_focus_str += '.uiform-main-form .uiform-wiztheme0 .uiform-steps li.uifm-current a:active {';
							border_focus_str += 'background:' + wiz_active_bgcol + '!important;';
							border_focus_str += 'color:' + wiz_active_txtcol + ';';
							border_focus_str += '} ';

							border_focus_str += '.uiform-wiztheme0 .uiform-steps .uifm-number:before{';
							border_focus_str += ' border-left:14px solid ' + wiz_inactive_bgcol + '!important;';
							border_focus_str += '} ';

							border_focus_str += '.uiform-step-list.uiform-wiztheme0 {';
							if (parseInt(wiz_cont_borcol.length) != 0) {
								border_focus_str += ' border:1px solid ' + wiz_cont_borcol + '!important;';
							}
							if (parseInt(wiz_cont_bgcolor.length) != 0) {
								border_focus_str += ' background-color: ' + wiz_cont_bgcolor + '!important;';
							}
							border_focus_str += '} ';
							border_focus_str += '</style>';
							$('head').append(border_focus_str);

							break;
						case 1:
							var wiz_active_bgcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_bgcolor');

							var wiz_active_txtcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_txtcolor');

							var wiz_active_numtxtcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_numtxtcolor');

							var wiz_active_bg_numtxt = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_bg_numtxt');

							var wiz_inactive_bgcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_bgcolor');

							var wiz_inactive_txtcol = this.getUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_txtcolor');

							$('#' + f_id + '_tab').remove();
							border_focus_str = '<style type="text/css" id="' + f_id + '_tab">';
							border_focus_str += '.uiform-wiztheme1 .uiform-steps li.uifm-current::before,';
							border_focus_str += '.uiform-wiztheme1 .uiform-steps li.uifm-complete::before,';
							border_focus_str += '.uiform-wiztheme1 .uiform-steps li.uifm-current .uifm-number,';
							border_focus_str += '.uiform-wiztheme1 .uiform-steps li.uifm-complete .uifm-number {';
							border_focus_str += 'border-color:' + wiz_active_bgcol + '!important;';
							border_focus_str += '} ';

							border_focus_str += '.uiform-wiztheme1 .uiform-steps li .uifm-number{';
							border_focus_str += 'background-color: ' + wiz_active_bg_numtxt + '!important;';
							border_focus_str += 'color:' + wiz_active_numtxtcol + ';';
							border_focus_str += 'border: 5px solid ' + wiz_inactive_bgcol + ';';
							border_focus_str += '}';

							border_focus_str += '.uiform-wiztheme1 .uiform-steps li .uifm-title{';
							border_focus_str += 'color:' + wiz_inactive_txtcol + ';';
							border_focus_str += '}';

							border_focus_str += '.uiform-wiztheme1 .uiform-steps li::before{';
							border_focus_str += 'border-top: 4px solid ' + wiz_inactive_bgcol + ';';
							border_focus_str += '}';

							border_focus_str += '.uiform-wiztheme1 .uiform-steps li.uifm-complete .uifm-title,';
							border_focus_str += '.uiform-wiztheme1 .uiform-steps li.uifm-current .uifm-title {';
							border_focus_str += 'color:' + wiz_active_txtcol + ';';
							border_focus_str += '}';

							border_focus_str += '</style>';
							$('head').append(border_focus_str);

							break;
					}
				} catch (ex) {
					console.error(' wizardtab_refreshPreview : ', ex.message);
				}
			};

			arguments.callee.wizardtab_saveChangesToMdata = function () {
				var wiz_st = $('#uifm_frm_wiz_st').prop('checked') ? 1 : 0;
				var wiz_theme_typ = parseInt($('#uifm_frm_wiz_theme_typ').val());
				var wiz_active_bgcol = $('#uifm_frm_wiz_tab_active_bgcolor').val();
				var wiz_active_txtcol = $('#uifm_frm_wiz_tab_active_txtcolor').val();
				var wiz_active_numtxtcol = $('#uifm_frm_wiz_tab_active_numtxtcolor').val();
				var wiz_inactive_bgcol = $('#uifm_frm_wiz_tab_inactive_bgcolor').val();
				var wiz_inactive_txtcol = $('#uifm_frm_wiz_tab_inactive_txtcolor').val();
				var wiz_inactive_numtxtcol = $('#uifm_frm_wiz_tab_inactive_numtxtcolor').val();
				var wiz_done_bgcol = $('#uifm_frm_wiz_tab_done_bgcolor').val();
				var wiz_done_txtcol = $('#uifm_frm_wiz_tab_done_txtcolor').val();
				var wiz_done_numtxtcol = $('#uifm_frm_wiz_tab_done_numtxtcolor').val();
				var wiz_container_bgcol = $('#uifm_frm_wiz_tab_cont_bgcolor').val();
				var wiz_container_borcol = $('#uifm_frm_wiz_tab_cont_borcol').val();

				this.setUiData2('wizard', 'enable_st', wiz_st);
				this.setUiData2('wizard', 'theme_type', wiz_theme_typ);
				switch (wiz_theme_typ) {
					case 0:
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_bgcolor', wiz_active_bgcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_txtcolor', wiz_active_txtcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_numtxtcolor', wiz_active_numtxtcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_bgcolor', wiz_inactive_bgcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_txtcolor', wiz_inactive_txtcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_numtxtcolor', wiz_inactive_numtxtcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_done_bgcolor', wiz_done_bgcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_done_txtcolor', wiz_done_txtcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_done_numtxtcolor', wiz_done_numtxtcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cont_bgcolor', wiz_container_bgcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cont_borcol', wiz_container_borcol);
						break;
					case 1:
						var wiz_active_bg_numtxt = $('#uifm_frm_wiz_tab_active_bg_numtxt').val();
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_bgcolor', wiz_active_bgcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_txtcolor', wiz_active_txtcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_numtxtcolor', wiz_active_numtxtcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_cur_bg_numtxt', wiz_active_bg_numtxt);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_bgcolor', wiz_inactive_bgcol);
						this.setUiData4('wizard', 'theme', wiz_theme_typ, 'skin_tab_inac_txtcolor', wiz_inactive_txtcol);

						break;
				}
			};
			arguments.callee.wizardtab_tabManualEvt = function (element, selected) {
				var el;
				if (selected) {
					var tmp_el = $(element).closest('.uifm_frm_skin_tab_content').attr('data-tab-nro');
					var tmp_tabhead = $('.uiform-step-list .uiform-steps a[data-tab-nro=' + tmp_el + ']');
					el = tmp_tabhead.parent();
				} else {
					el = $(element);
				}
				$('ul.uiform-steps li').removeClass('uifm-current').addClass('uifm-disabled');
				el.addClass('uifm-current').removeClass('uifm-disabled');
				$('.uiform-step-pane').hide();

				var activeTab = el.find('a').attr('href');

				$(activeTab).show();
			};
			arguments.callee.wizardtab_tabManageEvt = function () {
				$('ul.uiform-steps li').on('click', function () {
					rocketform.wizardtab_tabManualEvt(this, false);
					return false;
				});
			};
			arguments.callee.fieldsetting_updateName = function (step, id, name) {
				try {
					this.setUiData4('steps_src', String(step), String(id), 'field_name', name);
				} catch (ex) {
					console.error('  updateName error : ', ex.message);
				}
			};
			arguments.callee.fieldsetting_deleteField = function (idselected) {
				var fld_step = $('#' + idselected)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				$('#' + idselected).remove();
				rocketform.closeSettingTab();
				rocketform.delUiData3('steps_src', fld_step, idselected);
				var tmp_arr = mainrformb['steps_src'][fld_step];
				var tmp_len = tmp_arr.length,
					tmp_i;
				for (tmp_i = 0; tmp_i < tmp_len; tmp_i++) tmp_arr[tmp_i] && tmp_arr.push(tmp_arr[tmp_i]);
				if ($.isArray(tmp_arr)) {
					tmp_arr.splice(0, tmp_len);
					mainrformb['steps_src'][fld_step] = tmp_arr;
				}
			};

			arguments.callee.fieldsetting_deleteFieldFromPreview = function (el) {
				var box_title = $('#uifm_fld_del_box_title').val(),
					box_msg = $('#uifm_fld_del_box_msg').val(),
					btn1_title = $('#uifm_fld_del_box_bt1_title').val(),
					btn2_title = $('#uifm_fld_del_box_bt2_title').val();

				bootbox.dialog({
					message: box_msg,
					title: box_title,
					buttons: {
						fld_del_opt1: {
							label: btn1_title,
							className: 'sfdc-btn-default',
							callback: function () {
								$('body').removeClass('sfdc-modal-open');
							}
						},
						fld_del_opt2: {
							label: btn2_title,
							className: 'sfdc-btn-primary',
							callback: function () {
								var idselected = $(el).closest('.uiform-field').attr('id');
								rocketform.fieldsetting_deleteField(idselected);

								rocketform.formvariables_removeFromlist(idselected);

								rocketform.fieldsdata_email_genListToIntMem();

								zgfm_back_helper.tooltip_removeall();

								$('body').removeClass('sfdc-modal-open');
							}
						}
					}
				});
			};

			arguments.callee.fieldsetting_deleteFieldDialog = function () {
				var box_title = $('#uifm_fld_del_box_title').val(),
					box_msg = $('#uifm_fld_del_box_msg').val(),
					btn1_title = $('#uifm_fld_del_box_bt1_title').val(),
					btn2_title = $('#uifm_fld_del_box_bt2_title').val();

				bootbox.dialog({
					message: box_msg,
					title: box_title,
					buttons: {
						fld_del_opt1: {
							label: btn1_title,
							className: 'sfdc-btn-default',
							callback: function () {
								$('body').removeClass('sfdc-modal-open');
							}
						},
						fld_del_opt2: {
							label: btn2_title,
							className: 'sfdc-btn-primary',
							callback: function () {
								var idselected = $('#uifm-field-selected-id').val();
								rocketform.fields2_fieldsetting_deleteField(idselected);

								rocketform.formvariables_removeFromlist(idselected);

								rocketform.fieldsdata_email_genListToIntMem();

								zgfm_back_helper.tooltip_removeall();

								$('body').removeClass('sfdc-modal-open');
							}
						}
					}
				});
			};

			arguments.callee.mainfields_addFieldToForm = function (element, field_type) {
				try {
					var cur_step = $('.uiform-step-content .uiform-step-pane:visible').data('uifm-step');
					var el = $(element).clone();

					$('.uiform-step-content #uifm-step-tab-' + cur_step + ' .uiform-items-container:first').append(el);
					rocketform.showLoader(1, true, true);
					rocketform.getFieldsAfterDraggable(el, field_type, true, '');
				} catch (ex) {
					console.error('mainfields_addFieldToForm error : ', ex.message);
				}
			};
			arguments.callee.previewform_resizeBox = function (type) {
				var prev_box_desk_title = $('#uifm_frm_preview_msg_desktop_title').val();
				var prev_box_tablet_title = $('#uifm_frm_preview_msg_tablet_title').val();
				var prev_box_phone_title = $('#uifm_frm_preview_msg_phone_title').val();

				$('#uifm_preview_form').find('.sfdc-modal-dialog').attr('class', 'sfdc-modal-dialog');
				switch (parseInt(type)) {
					case 1:
						$('#uifm_preview_form').find('.sfdc-modal-dialog').animate({ width: 1100 }, 200);
						$('#uifm_preview_form').find('.sfdc-modal-dialog').find('iframe').css('width', 1070);

						$('#uifm_preview_form').find('.sfdc-modal-dialog').find('.sfdc-modal-title').html(prev_box_desk_title);

						break;
					case 2:
						$('#uifm_preview_form').find('.sfdc-modal-dialog').animate({ width: 750 }, 200);
						$('#uifm_preview_form').find('.sfdc-modal-dialog').find('iframe').css('width', 720);
						$('#uifm_preview_form').find('.sfdc-modal-dialog').find('.sfdc-modal-title').html(prev_box_tablet_title);
						break;
					case 3:
						$('#uifm_preview_form').find('.sfdc-modal-dialog').animate({ width: 320 }, 200).addClass('uifm_preview_phone');
						$('#uifm_preview_form').find('.sfdc-modal-dialog').find('iframe').css('width', 300);
						$('#uifm_preview_form').find('.sfdc-modal-dialog').find('.sfdc-modal-title').html(prev_box_phone_title);

						break;
				}
			};
			arguments.callee.previewform_showForm = function (type) {
				var idform = $('#uifm_frm_main_id').val();
				var prev_msg_notsaved = $('#uifm_frm_preview_msg_notsaved').val();
				var prev_box_desk_title = $('#uifm_frm_preview_msg_desktop_title').val();
				var prev_box_tablet_title = $('#uifm_frm_preview_msg_tablet_title').val();
				var prev_box_phone_title = $('#uifm_frm_preview_msg_phone_title').val();
				var windowWidth = $(window).width(); 
				var windowHeight = $(window).height(); 
				var documentWidth = $(document).width(); 
				var documentHeight = $(document).height(); 
				if (parseInt(idform) > 0) {
					$('#uifm_preview_form').removeData('bs.modal');
					$('#uifm_preview_form').sfdc_modal('show');
					switch (parseInt(type)) {
						case 1:
							$('#uifm_preview_form').find('.sfdc-modal-title').text(prev_box_desk_title);
							break;
						case 2:
							$('#uifm_preview_form').find('.sfdc-modal-title').text(prev_box_tablet_title);
							break;
						case 3:
							$('#uifm_preview_form').find('.sfdc-modal-title').text(prev_box_phone_title);
							break;
					}

					zgfm_back_helper.tooltip_removeall();

					$.ajax({
						type: 'POST',
						url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_load_preview_form',
						data: {
							action: 'rocket_fbuilder_load_preview_form',
							page: 'zgfm_form_builder',
							zgfm_security: uiform_vars.ajax_nonce,
							form_id: idform,
							csrf_field_name: uiform_vars.csrf_field_name
						},
						success: function (msg) {
							$('#uifm_preview_form').find('.sfdc-modal-body').html(msg);
							rocketform.previewform_resizeBox(type);
						}
					});
				} else {
					bootbox.alert(prev_msg_notsaved, function () {});
				}
			};

			arguments.callee.previewform_onClosePopUp = function () {
				$('.uiform_popover_frontend').popover('destroy');
			};

			arguments.callee.listform_duplicate = function () {
				if ($('.uiform-listform-chk-id').is(':checked')) {
					var data = $('#uiform-form-listform').serialize();
					$.ajax({
						type: 'POST',
						url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_listform_duplicate',
						data: data + '&action=rocket_fbuilder_listform_duplicate&page=zgfm_form_builder&csrf_field_name=' + uiform_vars.csrf_field_name,
						success: function (msg) {
							rocketform.redirect_tourl(uiform_vars.url_admin + 'formbuilder/forms/list_uiforms');
						}
					});
				} else {
					$('#uifm_modal_msg').sfdc_modal('show');
					$('#uifm_modal_msg .sfdc-modal-title').html($('#uifm_listform_popup_title').val());
					$('#uifm_modal_msg .sfdc-modal-body').html('<p>' + $('#uifm_listform_popup_notforms').val() + '</p>');
				}
			};

			arguments.callee.listform_selectallforms = function (element) {
				var el = $(element);
				if (el.is(':checked')) {
					$('.uiform-listform-chk-id').prop('checked', true);
				} else {
					$('.uiform-listform-chk-id').prop('checked', false);
				}
			};
			arguments.callee.modal_centerPos = function (el) {
				el.each(function (i) {
					var $clone = $(this).clone().css('display', 'block').appendTo('body');
					var top = Math.round(($clone.height() - $clone.find('.sfdc-modal-content').height()) / 2);
					top = top > 0 ? top : 0;
					$clone.remove();
					$(this).find('.sfdc-modal-content').css('margin-top', top);
				});
			};

			arguments.callee.listform_updateStatus = function (form_st) {
				if ($('.uiform-listform-chk-id').is(':checked')) {
					var data = $('#uiform-form-listform').serialize();
					$.ajax({
						type: 'POST',
						url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_listform_updatest',
						data:
							data +
							'&action=rocket_fbuilder_listform_updatest&page=zgfm_form_builder&form_st=' +
							form_st +
							'&zgfm_security=' +
							uiform_vars.ajax_nonce +
							'&csrf_field_name=' +
							uiform_vars.csrf_field_name,
						success: function (msg) {
							rocketform.redirect_tourl(uiform_vars.url_admin + 'formbuilder/forms/list_uiforms');
						}
					});
				} else {
					$('#uifm_modal_msg').sfdc_modal('show');
					$('#uifm_modal_msg .sfdc-modal-title').html($('#uifm_listform_popup_title').val());
					$('#uifm_modal_msg .sfdc-modal-body').html('<p>' + $('#uifm_listform_popup_notforms').val() + '</p>');
					$('#uifm_modal_msg').on('show.bs.modal', rocketform.modal_centerPos($('#uifm_modal_msg')));
				}
			};

			arguments.callee.listrecords_exportToCsv = function () {
				try {
					var idrec = $('#uifm-record-form-cmb').val();

					$('body').append("<iframe src='" + uiform_vars.url_admin + 'formbuilder/records/action_csv_show_allrecords/?id=' + idrec + "' style='display: none;' ></iframe>");
				} catch (ex) {
					console.error('listrecords_exportToCsv : ', ex.message);
				}
			};

			arguments.callee.listform_deleteFormById = function (idform) {
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_delete_form_byid',
					data: {
						action: 'rocket_fbuilder_delete_form',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						form_id: idform,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						rocketform.redirect_tourl(uiform_vars.url_admin + 'formbuilder/forms/list_uiforms');
					}
				});
			};
			arguments.callee.input2settings_labelOption = function (element) {
				var el = $(element);
				var optnro = el.closest('.uifm-fld-inp2-options-row').data('opt-index');
				var f_id = $('#uifm-field-selected-id').val();
				var opt_value = $('#uifm_frm_inp2_opt' + optnro + '_label').val();

				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', optnro, 'label', opt_value);
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');


				switch (parseInt(f_type)) {
					case 8:
						$('#' + f_id)
							.data('uiform_radiobtn')
							.input2settings_preview_genAllOptions();
						break;
					case 9:
						$('#' + f_id)
							.data('uiform_checkbox')
							.input2settings_preview_genAllOptions();
						break;
					case 10:

						$('#' + f_id)
							.data('uiform_select')
							.input2settings_preview_genAllOptions();

						break;
					case 11:
						$('#' + f_id)
							.data('uiform_multiselect')
							.input2settings_preview_genAllOptions();
						break;
				}
			};

			arguments.callee.input2settings_stl1_quickcolor = function (option) {
				var f_id = $('#uifm-field-selected-id').val();

				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');

				switch (parseInt(f_type)) {
					case 10:
						$('#' + f_id)
							.data('uiform_select')
							.input2settings_stl1_quickcolor(option);
						break;
					case 11:
						$('#' + f_id)
							.data('uiform_multiselect')
							.input2settings_stl1_quickcolor(option);
						break;
				}
			};

			arguments.callee.input2settings_valueOption = function (element) {
				var el = $(element);
				var optnro = el.closest('.uifm-fld-inp2-options-row').data('opt-index');
				var f_id = $('#uifm-field-selected-id').val();
				var opt_value = $('#uiform-build-field-tab')
					.find('#uifm_frm_inp2_opt' + optnro + '_value')
					.val();
				opt_value = uifm_stripHTML(opt_value);

				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');

				rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', optnro, 'value', opt_value);
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');
			};

			arguments.callee.input2settings_statusRdoOption = function (element) {
				var el = $(element);
				var f_id = $('#uifm-field-selected-id').val();
				var type = $('#uifm-field-selected-type').val();

				switch (parseInt(type)) {
					case 8:

						$('#' + f_id)
							.data('uiform_radiobtn')
							.input2settings_statusRdoOption(el);
						break;
					case 9:
						$('#' + f_id)
							.data('uiform_checkbox')
							.input2settings_statusRdoOption(el);

						break;
					case 10:

						$('#' + f_id)
							.data('uiform_select')
							.input2settings_statusRdoOption(el);
						break;
					case 11:
						$('#' + f_id)
							.data('uiform_multiselect')
							.input2settings_statusRdoOption(el);

						break;
				}
			};

			arguments.callee.input17settings_deleteOption = function (element) {
				var el = $(element);
				var f_id = $('#uifm-field-selected-id').val();
				var opt_index = el.closest('.uifm-fld-inp17-options-row').data('opt-index');

				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');

				el.closest('.uifm-fld-inp17-options-row').remove();
				rocketform.delUiData6('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(opt_index));

				var tmp_arr = mainrformb['steps_src'][parseInt(f_step)][f_id]['input17']['options'];
				var tmp_len = tmp_arr.length,
					tmp_i;
				for (tmp_i = 0; tmp_i < tmp_len; tmp_i++) tmp_arr[tmp_i] && tmp_arr.push(tmp_arr[tmp_i]);
				if ($.isArray(tmp_arr)) {
					tmp_arr.splice(0, tmp_len);
					mainrformb['steps_src'][parseInt(f_step)][f_id]['input17']['options'] = tmp_arr;
				}

				var prev_el_sel = $('#' + f_id)
					.find('.uifm-input17-wrap ')
					.find("[data-inp17-opt-index='" + opt_index + "']");
				prev_el_sel.remove();
			};

			arguments.callee.input17settings_deleteAllOptions = function () {
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');
				rocketform.setUiData5('steps_src', parseInt(f_step), f_id, 'input17', 'options', {});

				switch (parseInt(f_type)) {
					case 41:

						$('#' + f_id)
							.find('.uifm-dcheckbox-group')
							.html('');
						break;
					case 42:
						$('#' + f_id)
							.find('.uifm-dradiobtn-group')
							.html('');

						break;
				}

				$('#uifm-fld-inp17-options-container').html('');
			};
			arguments.callee.input17settings_addNewOption = function () {
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');
				var newopt;
				var img_obj_item;
				var thopt_mode = this.getUiData5('steps_src', f_step, f_id, 'input17', 'thopt_mode') || '1';

				var optindex = $('#uifm-fld-inp17-options-container .uifm-fld-inp17-options-row').length;
				while (parseInt($('#uifm-fld-inp17-options-container .uifm-fld-inp17-options-container .uifm-fld-inp17-options-row').length) != 0) {
					optindex = parseInt(optindex) + 1;
				}
				rocketform.addIndexUiData5('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex));
				rocketform.setUiData6('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), {
					label: 'Option 1',
					checked: 0,
					price: 0,
					img_list: {
						0: {
							img_full: '',
							img_th_150x150: '',
							title: 'image 1'
						}
					},
					img_list_2: {},
					qty_st: '0',
					qty_max: '2'
				});

				switch (parseInt(thopt_mode)) {
					case 2:
						rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list_2', 0);
						rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list_2', 0, { img_full: '' });
						rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list_2', 1);
						rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list_2', 1, { img_full: '' });
						rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list_2', 2);
						rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list_2', 2, { img_full: '' });
						break;
					case 1:
					default:
				}

				var options = this.getUiData6('steps_src', f_step, f_id, 'input17', 'options', parseInt(optindex));

				switch (parseInt(f_type)) {
					case 41:
						newopt = $('#uifm_frm_inp17_templates').find('.uifm-fld-inp17-options-row').clone();
						newopt.attr('data-opt-index', optindex);

						newopt.find('.uifm_frm_inp17_opt_label').val(options.label);
						newopt.find('.uifm_frm_inp17_opt_ckeck').prop('checked', parseInt(options.checked));
						newopt.find('.uifm_frm_inp17_opt_price').val(options.price);
						newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb();
						if (parseInt(options.qty_st)) {
							newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb('state', true);
						} else {
							newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb('state', false);
						}

						newopt.find('.uifm_fld_inp17_spinner').TouchSpin({
							verticalbuttons: true,
							min: 1,
							max: 1000000000,
							stepinterval: 1,
							verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
							verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
						});
						newopt.find('.uifm_frm_inp17_opt_qty_max').val(options.qty_max);


						switch (parseInt(thopt_mode)) {
							case 2:
								$.each(options.img_list_2, function (index2, value2) {
									img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm_frm_inp17_opt2_imgwrap').clone();
									if (value2['img_full']) {
										img_obj_item.find('.sfdc-img-thumbnail').attr('src', value2['img_full']);
									} else {
										img_obj_item.find('.sfdc-img-thumbnail').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
									}
									img_obj_item.attr('data-opt-index', index2);
									newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap').append(img_obj_item);
								});

								newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="0"]').find('.col-md-8 p').attr('class', 'alert alert-success').html('Checked');
								newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="1"]').find('.col-md-8 p').attr('class', 'alert alert-warning').html('Hover');
								newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="2"]').find('.col-md-8 p').attr('class', 'alert alert-info').html('Unchecked');

								break;
							case 1:
							default:
								if (options.img_list) {
									$.each(options.img_list, function (index2, value2) {
										img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm_frm_inp17_opt_imgwrap').clone();
										if (value2['img_th_150x150']) {
											img_obj_item.find('.sfdc-img-thumbnail').attr('src', value2['img_th_150x150']);
										} else {
											img_obj_item.find('.sfdc-img-thumbnail').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
										}

										img_obj_item.find('.uifm_frm_inp17_opt_imgitem_title').val(value2['title']);
										newopt.find('.uifm_frm_inp17_opt_img_list_wrap').append(img_obj_item);
									});
								}
						}

						$('#uifm-fld-inp17-options-container').append(newopt);
						$('#uifm-fld-inp17-options-container .autogrow').autogrow();
						break;

					case 42:
						newopt = $('#uifm_frm_inp17_templates').find('.uifm-fld-inp17-options-row').clone();
						newopt.attr('data-opt-index', optindex);

						newopt.find('.uifm_frm_inp17_opt_label').val(options.label);
						newopt.find('.uifm_frm_inp17_opt_ckeck').prop('checked', parseInt(options.checked));
						newopt.find('.uifm_frm_inp17_opt_price').val(options.price);
						newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb();
						if (parseInt(options.qty_st)) {
							newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb('state', true);
						} else {
							newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb('state', false);
						}

						newopt.find('.uifm_fld_inp17_spinner').TouchSpin({
							verticalbuttons: true,
							min: 1,
							max: 1000000000,
							stepinterval: 1,
							verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
							verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
						});
						newopt.find('.uifm_frm_inp17_opt_qty_max').val(options.qty_max);

						switch (parseInt(thopt_mode)) {
							case 2:
								$.each(options.img_list_2, function (index2, value2) {
									img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm_frm_inp17_opt2_imgwrap').clone();
									if (value2['img_full']) {
										img_obj_item.find('.sfdc-img-thumbnail').attr('src', value2['img_full']);
									} else {
										img_obj_item.find('.sfdc-img-thumbnail').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
									}
									img_obj_item.attr('data-opt-index', index2);
									newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap').append(img_obj_item);
								});

								newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="0"]').find('.col-md-8 p').attr('class', 'alert alert-success').html('Checked');
								newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="1"]').find('.col-md-8 p').attr('class', 'alert alert-warning').html('Hover');
								newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="2"]').find('.col-md-8 p').attr('class', 'alert alert-info').html('Unchecked');

								break;
							case 1:
							default:
								if (options.img_list) {
									$.each(options.img_list, function (index2, value2) {
										img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm_frm_inp17_opt_imgwrap').clone();
										if (value2['img_th_150x150']) {
											img_obj_item.find('.sfdc-img-thumbnail').attr('src', value2['img_th_150x150']);
										} else {
											img_obj_item.find('.sfdc-img-thumbnail').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
										}

										img_obj_item.find('.uifm_frm_inp17_opt_imgitem_title').val(value2['title']);
										newopt.find('.uifm_frm_inp17_opt_img_list_wrap').append(img_obj_item);
									});
								}
						}
						$('#uifm-fld-inp17-options-container').append(newopt);
						$('#uifm-fld-inp17-options-container .autogrow').autogrow();
						break;
				}

				rocketform.input17settings_showOptionbyLayMode(thopt_mode);

				newopt.find('.switch-field-17').on('switchChange.bootstrapSwitchZgpb', function (event, state) {
					var f_val = state ? 1 : 0;
					rocketform.input17settings_updateOption($(this), f_val, 'qty_st');
				});

				newopt.find('.uifm_frm_inp17_opt_qty_max').on('change', function (e) {
					var f_val = $(e.target).val();
					rocketform.input17settings_updateOption($(e.target), f_val, 'qty_max');
				});

				rocketform.input17settings_preview_addNew(parseInt(optindex));
			};
			arguments.callee.input17settings_preview_addNew = function (optindex) {
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var options = this.getUiData6('steps_src', f_step, f_id, 'input17', 'options', parseInt(optindex));
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');

				var thopt_mode = this.getUiData5('steps_src', f_step, f_id, 'input17', 'thopt_mode') || '1';

				var tmp_img_list;
				switch (parseInt(thopt_mode)) {
					case 2:
						tmp_img_list = options.img_list_2;
						break;
					case 1:
					default:
						tmp_img_list = options.img_list;
				}

				var newopt;
				var img_obj_item;
				switch (parseInt(f_type)) {
					case 41:
						newopt = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item').clone();
						newopt.attr('data-inp17-opt-index', optindex);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'label', null, null, options.label);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'checked', null, null, options.checked);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'price', null, null, options.price);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'qty_st', null, null, options.qty_st);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'qty_max', null, null, options.qty_max);
						if (tmp_img_list) {
							$.each(tmp_img_list, function (index2, value2) {
								img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item-imgsrc').clone();
								if (value2['img_full']) {
									img_obj_item.attr('href', value2['img_full']);
								} else {
									img_obj_item.attr('href', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
								}
								if (value2['img_th_150x150']) {
									img_obj_item.find('img').attr('src', value2['img_th_150x150']);
								} else {
									img_obj_item.find('img').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
								}
								img_obj_item.attr('title', value2['title']);
								newopt.find('.uifm-dcheckbox-item-gal-imgs').append(img_obj_item);
							});
						}

						$('#' + f_id)
							.find('.uifm-dcheckbox-group')
							.append(newopt);
						newopt.uiformDCheckbox();
						break;
					case 42:
						newopt = $('#uifm_frm_inp17_templates').find('.uifm-dradiobtn-item').clone();
						newopt.attr('data-inp17-opt-index', optindex);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'label', null, null, options.label);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'checked', null, null, options.checked);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'price', null, null, options.price);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'qty_st', null, null, options.qty_st);
						rocketform.input17settings_preview_setOption(newopt, optindex, 'qty_max', null, null, options.qty_max);
						if (tmp_img_list) {
							$.each(tmp_img_list, function (index2, value2) {
								img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item-imgsrc').clone();
								if (value2['img_full']) {
									img_obj_item.attr('href', value2['img_full']);
								} else {
									img_obj_item.attr('href', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
								}
								if (value2['img_th_150x150']) {
									img_obj_item.find('img').attr('src', value2['img_th_150x150']);
								} else {
									img_obj_item.find('img').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
								}
								img_obj_item.attr('title', value2['title']);
								newopt.find('.uifm-dcheckbox-item-gal-imgs').append(img_obj_item);
							});
						}

						$('#' + f_id)
							.find('.uifm-dradiobtn-group')
							.append(newopt);
						newopt.uiformDCheckbox();
						break;
				}
			};
			arguments.callee.input2settings_addNewRdoOption = function () {
				var newopt = $('#uifm_frm_inp2_templates').find('.uifm-fld-inp2-options-row').clone();
				var num = $('#uifm-fld-inp2-options-container .uifm-fld-inp2-options-row').length;

				var f_id = $('#uifm-field-selected-id').val();

				optindex = zgfm_back_helper.generateUniqueID(5);
				var lenArrs = $('#uifm-fld-inp2-options-container').find('.uifm-fld-inp2-options-row').length;
				var numorder = parseInt(lenArrs) + 1;

				newopt.attr('data-opt-index', optindex);

				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');

				if (parseInt(num) === 0) {
					rocketform.setUiData5('steps_src', parseInt(f_step), f_id, 'input2', 'options', {});
				}

				switch (parseInt(f_type)) {
					case 8:
						newopt.find('.uifm_frm_inp2_opt_checked').attr('id', 'uifm_frm_inp2_opt' + optindex + '_rdo');
						newopt.find('.uifm_frm_inp2_opt_checked').attr('type', 'radio');
						newopt.find('.uifm_frm_inp2_opt_checked').attr('name', 'uifm_inp2_rdo');
						break;
					case 9:
						newopt.find('.uifm_frm_inp2_opt_checked').attr('id', 'uifm_frm_inp2_opt' + optindex + '_chk');
						newopt.find('.uifm_frm_inp2_opt_checked').attr('name', 'uifm_inp2_chk');
						break;
					case 10:
						newopt.find('.uifm_frm_inp2_opt_checked').attr('id', 'uifm_frm_inp2_opt' + optindex + '_rdo');
						newopt.find('.uifm_frm_inp2_opt_checked').attr('type', 'radio');
						newopt.find('.uifm_frm_inp2_opt_checked').attr('name', 'uifm_inp2_rdo');
						break;
					case 11:
						newopt.find('.uifm_frm_inp2_opt_checked').attr('id', 'uifm_frm_inp2_opt' + optindex + '_chk');
						newopt.find('.uifm_frm_inp2_opt_checked').attr('name', 'uifm_inp2_chk');
						break;
				}

				newopt.find('.uifm_frm_inp2_opt_label_evt').attr('id', 'uifm_frm_inp2_opt' + optindex + '_label');
				newopt.find('.uifm_frm_inp2_opt_label_evt').val('New option');

				newopt.find('.uifm_frm_inp2_opt_value_evt').attr('id', 'uifm_frm_inp2_opt' + optindex + '_value');
				newopt.find('.uifm_frm_inp2_opt_value_evt').val('New option');

				$('#uifm-fld-inp2-options-container').append(newopt);

				rocketform.addIndexUiData5('steps_src', parseInt(f_step), f_id, 'input2', 'options', optindex);
				rocketform.setUiData6('steps_src', parseInt(f_step), f_id, 'input2', 'options', optindex, { value: 'Option', label: 'Option', checked: 0, order: numorder, id: optindex });

				var f_balign;
				var newoptprev;
				switch (parseInt(f_type)) {
					case 8:

						$('#' + f_id)
							.data('uiform_radiobtn')
							.input2settings_preview_genAllOptions();
						break;
					case 9:
						$('#' + f_id)
							.data('uiform_checkbox')
							.input2settings_preview_genAllOptions();

						break;
					case 10:

						$('#' + f_id)
							.data('uiform_select')
							.input2settings_preview_genAllOptions();
						break;
					case 11:

						$('#' + f_id)
							.data('uiform_multiselect')
							.input2settings_preview_genAllOptions();
						break;
				}
			};

			arguments.callee.input2settings_deleteAllOptions = function () {
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				rocketform.setUiData5('steps_src', parseInt(f_step), f_id, 'input2', 'options', {});
				$('#' + f_id)
					.find('.uifm-input2-wrap ')
					.html('');
				$('#uifm-fld-inp2-options-container').html('');
			};

			arguments.callee.input2settings_fillBlankValues = function () {
				var content = $('#uifm-fld-inp2-options-container');

				var vindex, tmp_label;
				content.find('.uifm-fld-inp2-options-row').each(function (i) {
					vindex = $(this).attr('data-opt-index');
					tmp_label = $('#uifm_frm_inp2_opt' + vindex + '_label').val();

					$('#uifm_frm_inp2_opt' + vindex + '_value')
						.val(tmp_label)
						.trigger('change');
				});
			};

			arguments.callee.input2settings_ImportBulkData = function () {
				try {
					rocketform.fields_showModalOptions();

					$.ajax({
						type: 'POST',
						url: rockfm_vars.uifm_siteurl + 'formbuilder/fields/ajax_field_sel_impbulkdata',
						data: {
							action: 'rocket_fbuilder_field_sel_impbulkdata',
							page: 'zgfm_form_builder',
							zgfm_security: uiform_vars.ajax_nonce,
							csrf_field_name: uiform_vars.csrf_field_name
						},
						success: function (msg) {
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-header-inner').html(msg.modal_header);
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.sfdc-modal-body').html(msg.modal_body);
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-footer-wrap').html(msg.modal_footer);
						}
					});
				} catch (ex) {
					console.error('uiform-core.js input2settings_ImportBulkData ', ex.message);
				}
			};

			arguments.callee.input2settings_ImportBulkData_process = function () {
				var tmp_data = $('#zgfm-fld-sel-opt-bulkdata').val();
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');

				var allTextLines = tmp_data.split(/\r\n|\n/);
				var headers = allTextLines[0].split('|');
				var lines = [];

				for (var i = 0; i < allTextLines.length; i++) {
					var data = allTextLines[i].split('|');
					if (data.length == headers.length) {
						var tarr = [];
						for (var j = 0; j < headers.length; j++) {
							tarr.push(data[j]);
						}
						lines.push(tarr);
					}
				}

				rocketform.input2settings_deleteAllOptions();

				var tmp_new_arr = {};
				var tmp_var1, tmp_var2, tmp_var3;
				for (var i in lines) {
					tmp_var1 = lines[i][0] || '';
					tmp_var2 = lines[i][1] || '';
					tmp_var3 = lines[i][2] || '';

					tmp_new_arr[i] = {
						value: tmp_var2,
						label: tmp_var1,
						checked: 0
					};
				}

				rocketform.setUiData5('steps_src', parseInt(f_step), f_id, 'input2', 'options', tmp_new_arr);


				switch (parseInt(f_type)) {
					case 8:

						$('#' + f_id)
							.data('uiform_radiobtn')
							.input2settings_preview_genAllOptions();
						break;
					case 9:

						$('#' + f_id)
							.data('uiform_checkbox')
							.input2settings_preview_genAllOptions();
						break;
					case 10:

						$('#' + f_id)
							.data('uiform_select')
							.input2settings_preview_genAllOptions();
						break;
					case 11:

						$('#' + f_id)
							.data('uiform_multiselect')
							.input2settings_preview_genAllOptions();
						break;
				}

				rocketform.input2settings_tabeditor_generateAllOptions();

				$('#zgpb-modal1').sfdc_modal('hide');
			};

			arguments.callee.clogic_removeAll = function () {
				$('#uifm-conditional-logic-list').html('');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				rocketform.setUiData5('steps_src', parseInt(f_step), f_id, 'clogic', 'list', []);
			};
			arguments.callee.clogic_tabeditor_generateAllOptions = function (options) {
				$('#uifm-conditional-logic-list').html('');
				var optindex;
				var logic_row;
				var logic_cont = $('#uifm-conditional-logic-list');

				$.each(options, function (index, value) {
					if (value && parseInt($('#' + value['field_fire']).length) != 0) {
						optindex = index;
						logic_row = $('#uiform-set-clogic-tmpl .uifm-conditional-row').clone();
						logic_row.attr('data-row-index', optindex);
						logic_cont.append(logic_row);

						rocketform.clogic_getListField(logic_row);

						logic_row.find('.uifm_clogic_fieldsel').val(value['field_fire']).trigger('chosen:updated');
						var field = rocketform.search_fieldById(value['field_fire']);

						rocketform.clogic_getTypeMatch(logic_row, field.type);
						logic_row.find('.uifm_clogic_mtype select').val(value['mtype']).trigger('chosen:updated');

						rocketform.clogic_getMatchInput(logic_row, field);
						switch (parseInt(field.type)) {
							case 8:
							case 9:
							case 10:
							case 11:
							case 41:
							case 42:
								if (parseInt(logic_row.find('.uifm_clogic_minput_1').find('option[value="' + value['minput'] + '"]').length) != 0) {
									logic_row.find('.uifm_clogic_minput_1').val(value['minput']).trigger('chosen:updated');
								} else {
									rocketform.clogic_tabeditor_removeifnomatch(index);
								}
								break;
							case 40:
								var tmp_val;
								if (parseInt(value['minput']) === 1) {
									tmp_val = '1';
								} else {
									tmp_val = '0';
								}
								logic_row.find('.uifm_clogic_minput_1').val(tmp_val).trigger('chosen:updated');
								break;
							case 16:
							case 18:
								logic_row.find('.uifm_clogic_minput_2').val(value['minput']);
								break;
						}
					} else {
						rocketform.clogic_tabeditor_removeifnomatch(index);
					}

				});
			};

			arguments.callee.clogic_tabeditor_removeifnomatch = function (index) {
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var opt_index = index;

				$('#uifm-conditional-logic-list')
					.find('.uifm-conditional-row[data-row-index="' + index + '"]')
					.remove();
				rocketform.delUiData6('steps_src', parseInt(f_step), f_id, 'clogic', 'list', parseInt(opt_index));
				var tmp_arr = mainrformb['steps_src'][parseInt(f_step)][f_id]['clogic']['list'];
				var tmp_len = tmp_arr.length,
					tmp_i;
				for (tmp_i = 0; tmp_i < tmp_len; tmp_i++) tmp_arr[tmp_i] && tmp_arr.push(tmp_arr[tmp_i]);
				if ($.isArray(tmp_arr)) {
					tmp_arr.splice(0, tmp_len);
					mainrformb['steps_src'][parseInt(f_step)][f_id]['clogic']['list'] = tmp_arr;
				}
			};

			arguments.callee.input17settings_addNewImg = function (el) {
				el = $(el);
				var f_id = $('#uifm-field-selected-id').val();
				var item_img = el.closest('.uifm-fld-inp17-options-row');
				var optindex = item_img.attr('data-opt-index');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var opt2index = el.closest('.uifm_frm_inp17_opt_imgwrap').attr('data-opt-index');

				var newopt2_optwrap = $('#uifm_frm_inp17_templates').find('.uifm_frm_inp17_opt_imgwrap').clone();
				newopt2_optwrap.find('.sfdc-img-thumbnail').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
				newopt2_optwrap.find('.uifm_frm_inp17_opt_imgitem_title').val('image description');
				var num_imgs = item_img.find('.uifm_frm_inp17_opt_img_list_wrap .uifm_frm_inp17_opt_imgwrap').length;

				var newopt2_optindex = parseInt(num_imgs);
				while (parseInt(item_img.find('.uifm_frm_inp17_opt_img_list_wrap .uifm_frm_inp17_opt_imgwrap').find("[data-opt-index='" + optindex + "']").length) != 0) {
					newopt2_optindex = parseInt(newopt2_optindex) + 1;
				}
				newopt2_optwrap.attr('data-opt-index', newopt2_optindex);

				item_img.find('.uifm_frm_inp17_opt_img_list_wrap').append(newopt2_optwrap);
				item_img.find('.uifm_frm_inp17_opt_img_list_wrap').find('.autogrow').autogrow();


				rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list', parseInt(newopt2_optindex));
				rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list', parseInt(newopt2_optindex), {
					img_full: '',
					img_th_150x150: '',
					title: 'image description'
				});
			};
			arguments.callee.input17settings_delImglistIndex = function (el) {
				el = $(el);
				var f_id = $('#uifm-field-selected-id').val();
				var item_img = el.closest('.uifm-fld-inp17-options-row');
				var optindex = item_img.attr('data-opt-index');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var opt2index = el.closest('.uifm_frm_inp17_opt_imgwrap').attr('data-opt-index');
				el.closest('.uifm_frm_inp17_opt_imgwrap').remove();
				rocketform.delUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list', parseInt(opt2index));
				var tmp_arr = mainrformb['steps_src'][parseInt(f_step)][f_id]['input17']['options'][parseInt(optindex)]['img_list'];
				var tmp_len = tmp_arr.length,
					tmp_i;
				for (tmp_i = 0; tmp_i < tmp_len; tmp_i++) tmp_arr[tmp_i] && tmp_arr.push(tmp_arr[tmp_i]);
				if ($.isArray(tmp_arr)) {
					tmp_arr.splice(0, tmp_len);
					mainrformb['steps_src'][parseInt(f_step)][f_id]['input17']['options'][parseInt(optindex)]['img_list'] = tmp_arr;
				}
			};

			arguments.callee.input17settings_labelOption = function (el) {
				el = $(el);
				var item_img = el.closest('.uifm-fld-inp17-options-row');
				var optindex = item_img.attr('data-opt-index');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_val = el.val();

				var opt2index = el.closest('.uifm_frm_inp17_opt_imgwrap').attr('data-opt-index');

				rocketform.setUiData9('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list', parseInt(opt2index), 'title', f_val);
			};

			arguments.callee.input17settings_preview_refreshImgs = function (item_main) {
				var optindex = item_main.attr('data-inp17-opt-index');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var img_list = rocketform.getUiData7('steps_src', f_step, f_id, 'input17', 'options', optindex, 'img_list');

				var img_list_2 = rocketform.getUiData7('steps_src', f_step, f_id, 'input17', 'options', optindex, 'img_list_2') || {};
				var thopt_mode = this.getUiData5('steps_src', f_step, f_id, 'input17', 'thopt_mode') || 1;

				var newoptprev2;
				item_main.find('.uifm-dcheckbox-item-gal-imgs').html('');

				switch (parseInt(thopt_mode)) {
					case 2:
						if (img_list_2) {
							$.each(img_list_2, function (index, value) {
								if (value) {
									newoptprev2 = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item-imgsrc').clone();
									newoptprev2.attr('data-inp17-opt2-index', index);
									item_main.find('.uifm-dcheckbox-item-gal-imgs').append(newoptprev2);
									rocketform.input17settings_preview_setOption(newoptprev2, optindex, 'img_list_2', index, 'img_full', value['img_full']);
								}
							});
						}

						break;
					case 1:
					default:
						$.each(img_list, function (index, value) {
							if (value) {
								newoptprev2 = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item-imgsrc').clone();
								newoptprev2.attr('data-inp17-opt2-index', index);
								item_main.find('.uifm-dcheckbox-item-gal-imgs').append(newoptprev2);
								rocketform.input17settings_preview_setOption(newoptprev2, optindex, 'img_list', index, 'title', value['title']);
								rocketform.input17settings_preview_setOption(newoptprev2, optindex, 'img_list', index, 'img_full', value['img_full']);
								rocketform.input17settings_preview_setOption(newoptprev2, optindex, 'img_list', index, 'img_th_150x150', value['img_th_150x150']);
							}
						});
				}
				item_main.uiformDCheckbox('refreshImgs');
			};

			arguments.callee.input18settings_savePaneBg = function (el, html) {
				var imgurl = $('img', html).attr('src') || $(html).attr('src');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				$('#uifm_frm_inp18_bg_srcimg_wrap').html('<img class="sfdc-img-thumbnail" src="' + imgurl + '">');

				rocketform.setUiData6('steps_src', parseInt(f_step), f_id, 'input18', 'pane_background', 'image', imgurl);

				this.input18settings_preview_genAllOptions($('#' + f_id), '');
			};

			arguments.callee.input17settings_saveSrcImgOption = function (el, html) {
				var item_img = el.closest('.uifm-fld-inp17-options-row');
				var optindex = item_img.attr('data-opt-index');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');
				var thopt_mode = this.getUiData5('steps_src', f_step, f_id, 'input17', 'thopt_mode') || 1;

				var opt2index;
				if (parseInt(thopt_mode) === 2) {
					opt2index = el.closest('.uifm_frm_inp17_opt2_imgwrap').attr('data-opt-index');
				} else {
					opt2index = el.closest('.uifm_frm_inp17_opt_imgwrap').attr('data-opt-index');
				}
				var imgurl = html;


				if (parseInt(thopt_mode) === 2) {
					item_img
						.find('.uifm_frm_inp17_opt_img_list_2_wrap')
						.find("[data-opt-index='" + opt2index + "']")
						.find('.sfdc-img-thumbnail')
						.attr('src', imgurl);
					rocketform.setUiData9('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list_2', parseInt(opt2index), 'img_full', imgurl);
				} else {
					item_img
						.find('.uifm_frm_inp17_opt_img_list_wrap')
						.find("[data-opt-index='" + opt2index + "']")
						.find('.sfdc-img-thumbnail')
						.attr('src', imgurl);
					rocketform.setUiData9('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list', parseInt(opt2index), 'img_full', imgurl);
					rocketform.setUiData9('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), 'img_list', parseInt(opt2index), 'img_th_150x150', imgurl);
				}
				var item_main;
				switch (parseInt(f_type)) {
					case 41:
						item_main = $('#' + f_id).find(".uifm-dcheckbox-item[data-inp17-opt-index='" + optindex + "']");
						break;
					case 42:
						item_main = $('#' + f_id).find(".uifm-dradiobtn-item[data-inp17-opt-index='" + optindex + "']");
						break;
				}

				rocketform.input17settings_preview_refreshImgs(item_main);
			};
			arguments.callee.input17settings_changeSrcImg = function (element) {
				var el = $(element);

				this.elfinder_showPopUp({
					windowURL: uiform_vars.url_elfinder2,
					windowName: '_blank',
					height: 490,
					width: 950,
					centerScreen: 1,
					location: 0
				});

				window.processFile = function (file) {
					rocketform.input17settings_saveSrcImgOption(el, file.url);
				};
			};

			arguments.callee.input18settings_changeSrcImg = function (element) {
				var el = $(element);

				this.elfinder_showPopUp({
					windowURL: uiform_vars.url_elfinder2,
					windowName: '_blank',
					height: 490,
					width: 950,
					centerScreen: 1,
					location: 0
				});

				window.processFile = function (file) {
					rocketform.input18settings_savePaneBg(el, file.url);
				};
			};

			arguments.callee.elfinder_showPopUp = function (instanceSettings) {
				var defaultSettings = {
					centerBrowser: 0, 
					centerScreen: 0, 
					height: 500, 
					left: 0, 
					location: 0, 
					menubar: 0, 
					resizable: 0, 
					scrollbars: 0, 
					status: 0, 
					width: 500, 
					windowName: null, 
					windowURL: null, 
					top: 0, 
					toolbar: 0 
				};

				var settings = $.extend({}, defaultSettings, instanceSettings || {});

				var windowFeatures =
					'height=' +
					settings.height +
					',width=' +
					settings.width +
					',toolbar=' +
					settings.toolbar +
					',scrollbars=' +
					settings.scrollbars +
					',status=' +
					settings.status +
					',resizable=' +
					settings.resizable +
					',location=' +
					settings.location +
					',menuBar=' +
					settings.menubar;

				settings.windowName = this.name || settings.windowName;
				settings.windowURL = this.href || settings.windowURL;
				var centeredY, centeredX;

				if (settings.centerBrowser) {
					if ($.browser.msie) {
						centeredY = window.screenTop - 120 + ((document.documentElement.clientHeight + 120) / 2 - settings.height / 2);
						centeredX = window.screenLeft + ((document.body.offsetWidth + 20) / 2 - settings.width / 2);
					} else {
						centeredY = window.screenY + (window.outerHeight / 2 - settings.height / 2);
						centeredX = window.screenX + (window.outerWidth / 2 - settings.width / 2);
					}
					window.open(settings.windowURL, settings.windowName, windowFeatures + ',left=' + centeredX + ',top=' + centeredY).focus();
				} else if (settings.centerScreen) {
					centeredY = (screen.height - settings.height) / 2;
					centeredX = (screen.width - settings.width) / 2;

					window.open(settings.windowURL, settings.windowName, windowFeatures + ',left=' + centeredX + ',top=' + centeredY).focus();
				} else {
					window.open(settings.windowURL, settings.windowName, windowFeatures + ',left=' + settings.left + ',top=' + settings.top).focus();
				}
				return false;
			};

			arguments.callee.input18settings_deleteBgImagePane = function () {
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');

				$('#uifm_frm_inp18_bg_srcimg_wrap').html('');
				rocketform.setUiData6('steps_src', parseInt(f_step), f_id, 'input18', 'pane_background', 'image', '');
				this.input18settings_preview_genAllOptions($('#' + f_id), '');
			};
			arguments.callee.input17settings_tabeditor_generateAllOptions = function () {
				$('#uifm-fld-inp17-options-container').html('');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');
				var options = this.getUiData5('steps_src', f_step, f_id, 'input17', 'options');

				var thopt_mode = this.getUiData5('steps_src', f_step, f_id, 'input17', 'thopt_mode') || '1';

				var newopt;
				var img_obj_item;
				switch (parseInt(f_type)) {
					case 41:
						$.each(options, function (index, value) {
							newopt = $('#uifm_frm_inp17_templates').find('.uifm-fld-inp17-options-row').clone();
							newopt.attr('data-opt-index', index);

							newopt.find('.uifm_frm_inp17_opt_label').val(value['label']);
							newopt.find('.uifm_frm_inp17_opt_ckeck').prop('checked', parseInt(value['checked']));
							newopt.find('.uifm_frm_inp17_opt_price').val(value['price']);
							newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb();
							if (parseInt(value['qty_st'])) {
								newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb('state', true);
							} else {
								newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb('state', false);
							}

							newopt.find('.uifm_fld_inp17_spinner').TouchSpin({
								verticalbuttons: true,
								min: 0,
								max: 1000000000,
								stepinterval: 1,
								verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
								verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
							});
							newopt.find('.uifm_frm_inp17_opt_qty_max').val(value['qty_max']);

							switch (parseInt(thopt_mode)) {
								case 2:
									if (!value['img_list_2'].length) {
										rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 0);
										rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 0, { img_full: '' });
										rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 1);
										rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 1, { img_full: '' });
										rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 2);
										rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 2, { img_full: '' });

										value['img_list_2'] = {
											0: {
												img_full: ''
											},
											1: {
												img_full: ''
											},
											2: {
												img_full: ''
											}
										};
									}
									$.each(value['img_list_2'], function (index2, value2) {
										img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm_frm_inp17_opt2_imgwrap').clone();
										if (value2['img_full']) {
											img_obj_item.find('.sfdc-img-thumbnail').attr('src', value2['img_full']);
										} else {
											img_obj_item.find('.sfdc-img-thumbnail').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
										}
										img_obj_item.attr('data-opt-index', index2);
										newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap').append(img_obj_item);
									});

									newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="0"]').find('.col-md-8 p').attr('class', 'alert alert-success').html('Checked');
									newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="1"]').find('.col-md-8 p').attr('class', 'alert alert-warning').html('Hover');
									newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="2"]').find('.col-md-8 p').attr('class', 'alert alert-info').html('Unchecked');

									break;
								case 1:
								default:
									if (value['img_list']) {
										$.each(value['img_list'], function (index2, value2) {
											img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm_frm_inp17_opt_imgwrap').clone();
											if (value2['img_th_150x150']) {
												img_obj_item.find('.sfdc-img-thumbnail').attr('src', value2['img_th_150x150']);
											} else {
												img_obj_item.find('.sfdc-img-thumbnail').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
											}

											img_obj_item.find('.uifm_frm_inp17_opt_imgitem_title').val(value2['title']);
											newopt.find('.uifm_frm_inp17_opt_img_list_wrap').append(img_obj_item);
										});
									}
							}

							$('#uifm-fld-inp17-options-container').append(newopt);
							$('#uifm-fld-inp17-options-container .autogrow').autogrow();
						});
						break;
					case 42:
						$.each(options, function (index, value) {
							newopt = $('#uifm_frm_inp17_templates').find('.uifm-fld-inp17-options-row').clone();
							newopt.attr('data-opt-index', index);

							newopt.find('.uifm_frm_inp17_opt_label').val(value['label']);
							newopt.find('.uifm_frm_inp17_opt_ckeck').prop('checked', parseInt(value['checked']));
							newopt.find('.uifm_frm_inp17_opt_price').val(value['price']);
							newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb();
							if (parseInt(value['qty_st'])) {
								newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb('state', true);
							} else {
								newopt.find('.uifm_frm_inp17_opt_qty_st').bootstrapSwitchZgpb('state', false);
							}

							newopt.find('.uifm_fld_inp17_spinner').TouchSpin({
								verticalbuttons: true,
								min: 0,
								max: 1000000000,
								stepinterval: 1,
								verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
								verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
							});
							newopt.find('.uifm_frm_inp17_opt_qty_max').val(value['qty_max']);

							switch (parseInt(thopt_mode)) {
								case 2:
									if (!value['img_list_2'].length) {
										rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 0);
										rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 0, { img_full: '' });
										rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 1);
										rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 1, { img_full: '' });
										rocketform.addIndexUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 2);
										rocketform.setUiData8('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(index), 'img_list_2', 2, { img_full: '' });

										value['img_list_2'] = {
											0: {
												img_full: ''
											},
											1: {
												img_full: ''
											},
											2: {
												img_full: ''
											}
										};
									}
									$.each(value['img_list_2'], function (index2, value2) {
										img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm_frm_inp17_opt2_imgwrap').clone();
										if (value2['img_full']) {
											img_obj_item.find('.sfdc-img-thumbnail').attr('src', value2['img_full']);
										} else {
											img_obj_item.find('.sfdc-img-thumbnail').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
										}
										img_obj_item.attr('data-opt-index', index2);
										newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap').append(img_obj_item);
									});

									newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="0"]').find('.col-md-8 p').attr('class', 'alert alert-success').html('Checked');
									newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="1"]').find('.col-md-8 p').attr('class', 'alert alert-warning').html('Hover');
									newopt.find('.uifm_frm_inp17_opt_img_list_2_wrap .uifm_frm_inp17_opt2_imgwrap[data-opt-index="2"]').find('.col-md-8 p').attr('class', 'alert alert-info').html('Unchecked');

									break;
								case 1:
								default:
									if (value['img_list']) {
										$.each(value['img_list'], function (index2, value2) {
											img_obj_item = $('#uifm_frm_inp17_templates').find('.uifm_frm_inp17_opt_imgwrap').clone();
											if (value2['img_th_150x150']) {
												img_obj_item.find('.sfdc-img-thumbnail').attr('src', value2['img_th_150x150']);
											} else {
												img_obj_item.find('.sfdc-img-thumbnail').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
											}

											img_obj_item.find('.uifm_frm_inp17_opt_imgitem_title').val(value2['title']);
											newopt.find('.uifm_frm_inp17_opt_img_list_wrap').append(img_obj_item);
										});
									}
							}

							$('#uifm-fld-inp17-options-container').append(newopt);
							$('#uifm-fld-inp17-options-container .autogrow').autogrow();
						});
						break;
				}


				rocketform.input17settings_showOptionbyLayMode(thopt_mode);

				$('#uifm-fld-inp17-options-container .switch-field-17').on('switchChange.bootstrapSwitchZgpb', function (event, state) {
					var f_val = state ? 1 : 0;
					rocketform.input17settings_updateOption($(this), f_val, 'qty_st');
				});

				$('#uifm-fld-inp17-options-container .uifm_frm_inp17_opt_qty_max').on('change', function (e) {
					var f_val = $(e.target).val();
					rocketform.input17settings_updateOption($(e.target), f_val, 'qty_max');
				});
			};

			arguments.callee.input17settings_showOptionbyLayMode = function (varmode) {
				if (parseInt(varmode) === 2) {
					$('#uifm-fld-inp17-options-container .uifm_frm_inp17_opt_img_list_1').hide();
					$('#uifm-fld-inp17-options-container .uifm_frm_inp17_opt_img_list_2').show();

					$('#uifm_fld_inp17_thopt_zoom_wrap').hide();
					$('#uifm_fld_inp17_thopt_usethmb_wrap').hide();
					$('#uifm_fld_inp17_thopt_showcheckb_wrap').show();
				} else {
					$('#uifm-fld-inp17-options-container .uifm_frm_inp17_opt_img_list_1').show();
					$('#uifm-fld-inp17-options-container .uifm_frm_inp17_opt_img_list_2').hide();
					$('#uifm_fld_inp17_thopt_zoom_wrap').show();
					$('#uifm_fld_inp17_thopt_usethmb_wrap').show();
					$('#uifm_fld_inp17_thopt_showcheckb_wrap').hide();
				}
			};

			arguments.callee.input17settings_enableCheckOption = function (el) {
				el = $(el);
				var option = el.attr('data-option-store');
				var f_val = el.is(':checked') ? 1 : 0;
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');

				var thopt_mode = this.getUiData5('steps_src', f_step, f_id, 'input17', 'thopt_mode') || '1';

				rocketform.input17settings_updateOption(el, f_val, option);
				var rowIndex = el.closest('.uifm-fld-inp17-options-row').attr('data-opt-index');

				var prevField;
				switch (parseInt(f_type)) {
					case 41:
						prevField = $('#' + f_id).find(".uifm-dcheckbox-item[data-inp17-opt-index='" + rowIndex + "']");
						break;
					case 42:
						prevField = $('#' + f_id).find(".uifm-dradiobtn-item[data-inp17-opt-index='" + rowIndex + "']");
						break;
				}

				prevField.uiformDCheckbox('man_optChecked', f_val);

				switch (parseInt(thopt_mode)) {
					case 2:
						prevField.uiformDCheckbox('man_mod2_refresh');
						break;
					case 1:
					default:
				}
			};
			arguments.callee.input17settings_onChangeOption = function (el) {
				el = $(el);
				var option = el.attr('data-option-store');
				var f_val = el.val();
				rocketform.input17settings_updateOption(el, f_val, option);

				var f_id = $('#uifm-field-selected-id').val();

				rocketform.input17settings_preview_genAllOptions($('#' + f_id), 'input17');
			};

			arguments.callee.input17settings_updateOption = function (obj, f_val, option) {
				var item_img = obj.closest('.uifm-fld-inp17-options-row');
				var optindex = item_img.attr('data-opt-index');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');
				rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input17', 'options', parseInt(optindex), option, f_val);
				var prevField;
				switch (parseInt(f_type)) {
					case 41:
						prevField = $('#' + f_id).find(".uifm-dcheckbox-item[data-inp17-opt-index='" + optindex + "']");
						break;
					case 42:
						prevField = $('#' + f_id).find(".uifm-dradiobtn-item[data-inp17-opt-index='" + optindex + "']");
						break;
				}

				switch (String(option)) {
					case 'qty_st':
						prevField.uiformDCheckbox('man_optQtySt', f_val);
						break;
					case 'qty_max':
						prevField.uiformDCheckbox('man_optQtyMax', f_val);
						break;
				}
			};

			arguments.callee.input2settings_tabeditor_generateAllOptions = function () {
				$('#uifm-fld-inp2-options-container').html('');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');
				var newopt;

				var options = this.getUiData5('steps_src', f_step, f_id, 'input2', 'options');
				switch (parseInt(f_type)) {
					case 8:
						$.each(options, function (index, value) {
							newopt = $('#uifm_frm_inp2_templates').find('.uifm-fld-inp2-options-row').clone();
							newopt.attr('data-opt-index', index);
							newopt.find('.uifm_frm_inp2_opt_checked').attr('id', 'uifm_frm_inp2_opt' + index + '_rdo');
							newopt.find('.uifm_frm_inp2_opt_checked').prop('checked', parseInt(value['checked']));
							newopt.find('.uifm_frm_inp2_opt_checked').attr('type', 'radio');
							newopt.find('.uifm_frm_inp2_opt_checked').attr('name', 'uifm_inp2_rdo');

							newopt.find('.uifm_frm_inp2_opt_label_evt').attr('id', 'uifm_frm_inp2_opt' + index + '_label');
							newopt.find('.uifm_frm_inp2_opt_label_evt').val(value['label']);

							newopt.find('.uifm_frm_inp2_opt_value_evt').attr('id', 'uifm_frm_inp2_opt' + index + '_value');
							newopt.find('.uifm_frm_inp2_opt_value_evt').val(value['value']);

							$('#uifm-fld-inp2-options-container').append(newopt);
						});
						break;
					case 9:
						$.each(options, function (index, value) {
							newopt = $('#uifm_frm_inp2_templates').find('.uifm-fld-inp2-options-row').clone();
							newopt.attr('data-opt-index', index);
							newopt.find('.uifm_frm_inp2_opt_checked').attr('id', 'uifm_frm_inp2_opt' + index + '_chk');
							newopt.find('.uifm_frm_inp2_opt_checked').prop('checked', parseInt(value['checked']));
							newopt.find('.uifm_frm_inp2_opt_checked').attr('name', 'uifm_inp2_chk');

							newopt.find('.uifm_frm_inp2_opt_label_evt').attr('id', 'uifm_frm_inp2_opt' + index + '_label');
							newopt.find('.uifm_frm_inp2_opt_label_evt').val(value['label']);

							newopt.find('.uifm_frm_inp2_opt_value_evt').attr('id', 'uifm_frm_inp2_opt' + index + '_value');
							newopt.find('.uifm_frm_inp2_opt_value_evt').val(value['value']);

							$('#uifm-fld-inp2-options-container').append(newopt);
						});
						break;
					case 10:
						$.each(options, function (index, value) {
							newopt = $('#uifm_frm_inp2_templates').find('.uifm-fld-inp2-options-row').clone();
							newopt.attr('data-opt-index', index);
							newopt.find('.uifm_frm_inp2_opt_checked').attr('id', 'uifm_frm_inp2_opt' + index + '_rdo');
							newopt.find('.uifm_frm_inp2_opt_checked').prop('checked', parseInt(value['checked']));
							newopt.find('.uifm_frm_inp2_opt_checked').attr('type', 'radio');
							newopt.find('.uifm_frm_inp2_opt_checked').attr('name', 'uifm_inp2_rdo');

							newopt.find('.uifm_frm_inp2_opt_label_evt').attr('id', 'uifm_frm_inp2_opt' + index + '_label');
							newopt.find('.uifm_frm_inp2_opt_label_evt').val(value['label']);

							newopt.find('.uifm_frm_inp2_opt_value_evt').attr('id', 'uifm_frm_inp2_opt' + index + '_value');
							newopt.find('.uifm_frm_inp2_opt_value_evt').val(value['value']);

							$('#uifm-fld-inp2-options-container').append(newopt);
						});
						break;
					case 11:
						$.each(options, function (index, value) {
							newopt = $('#uifm_frm_inp2_templates').find('.uifm-fld-inp2-options-row').clone();
							newopt.attr('data-opt-index', index);
							newopt.find('.uifm_frm_inp2_opt_checked').attr('id', 'uifm_frm_inp2_opt' + index + '_chk');
							newopt.find('.uifm_frm_inp2_opt_checked').prop('checked', parseInt(value['checked']));
							newopt.find('.uifm_frm_inp2_opt_checked').attr('name', 'uifm_inp2_chk');

							newopt.find('.uifm_frm_inp2_opt_label_evt').attr('id', 'uifm_frm_inp2_opt' + index + '_label');
							newopt.find('.uifm_frm_inp2_opt_label_evt').val(value['label']);

							newopt.find('.uifm_frm_inp2_opt_value_evt').attr('id', 'uifm_frm_inp2_opt' + index + '_value');
							newopt.find('.uifm_frm_inp2_opt_value_evt').val(value['value']);

							$('#uifm-fld-inp2-options-container').append(newopt);
						});
						break;
				}
			};

			arguments.callee.input2settings_deleteOption = function (element) {
				var el = $(element);
				var f_id = $('#uifm-field-selected-id').val();
				var opt_index = el.closest('.uifm-fld-inp2-options-row').data('opt-index');

				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = $('#uifm-field-selected-type').val();
				el.closest('.uifm-fld-inp2-options-row').remove();
				rocketform.delUiData6('steps_src', parseInt(f_step), f_id, 'input2', 'options', opt_index);
				var tmp_arr = mainrformb['steps_src'][parseInt(f_step)][f_id]['input2']['options'];
				var tmp_len = tmp_arr.length,
					tmp_i;
				for (tmp_i = 0; tmp_i < tmp_len; tmp_i++) tmp_arr[tmp_i] && tmp_arr.push(tmp_arr[tmp_i]);
				if ($.isArray(tmp_arr)) {
					tmp_arr.splice(0, tmp_len);
					mainrformb['steps_src'][parseInt(f_step)][f_id]['input2']['options'] = tmp_arr;
				}
				switch (parseInt(f_type)) {
					case 8:
						$('#' + f_id)
							.data('uiform_radiobtn')
							.input2settings_preview_genAllOptions();
						break;
					case 9:
						$('#' + f_id)
							.data('uiform_checkbox')
							.input2settings_preview_genAllOptions();
						break;
					case 10:

						$('#' + f_id)
							.data('uiform_select')
							.input2settings_preview_genAllOptions();

						break;
					case 11:
						$('#' + f_id)
							.data('uiform_multiselect')
							.input2settings_preview_genAllOptions();
						break;
				}
			};

			arguments.callee.input2settings_preview_genAllOptions = function (obj, section, option) {
			};
			arguments.callee.input17settings_preview_setOption = function (obj, index, opt, index2, opt2, value) {
				switch (String(opt)) {
					case 'label':
						obj.attr('title', value);
						obj.attr('data-opt-label', value);
						break;
					case 'price':
						obj.attr('data-opt-price', value);
						break;
					case 'checked':
						obj.attr('data-opt-checked', value);
						break;
					case 'qty_st':
						obj.attr('data-opt-qtyst', value);
						break;
					case 'qty_max':
						obj.attr('data-opt-qtymax', value);
						break;
					case 'img_list':
						switch (String(opt2)) {
							case 'title':
								obj.attr('title', value);
								break;
							case 'img_full':
								if (value) {
									obj.attr('href', value);
								} else {
									obj.attr('href', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
								}
								break;
							case 'img_th_150x150':
								if (value) {
									obj.find('img').attr('src', value);
								} else {
									obj.find('img').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
								}

								break;
						}
						break;
					case 'img_list_2':
						switch (String(opt2)) {
							case 'img_full':
								if (value) {
									obj.attr('href', value);
									obj.find('img').attr('src', value);
								} else {
									obj.attr('href', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
									obj.find('img').attr('src', uiform_vars.url_assets + '/common/imgs/uifm-question-mark.png');
								}
								break;
						}
						break;
				}
			};

			arguments.callee.input18settings_preview_genAllOptions = function (obj, section) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');

				var text_html_st = this.getUiData6('steps_src', f_step, f_id, 'input18', 'text', 'show_st'),
					text_html = this.getUiData6('steps_src', f_step, f_id, 'input18', 'text', 'html_cont'),
					text_html_pos = this.getUiData6('steps_src', f_step, f_id, 'input18', 'text', 'html_pos'),
					marg_show_st = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_margin', 'show_st'),
					marg_pos_top = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_margin', 'pos_top') || 0,
					marg_pos_right = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_margin', 'pos_right') || 0,
					marg_pos_bottom = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_margin', 'pos_bottom') || 0,
					marg_pos_left = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_margin', 'pos_left') || 0,
					pad_show_st = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_padding', 'show_st'),
					pad_pos_top = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_padding', 'pos_top') || 0,
					pad_pos_right = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_padding', 'pos_right') || 0,
					pad_pos_bottom = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_padding', 'pos_bottom') || 0,
					pad_pos_left = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_padding', 'pos_left') || 0,
					bg_show_st = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_background', 'show_st'),
					bg_type = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_background', 'type'),
					bg_start_color = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_background', 'start_color'),
					bg_end_color = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_background', 'end_color'),
					bg_solid_color = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_background', 'solid_color'),
					bg_image = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_background', 'image'),
					brad_show_st = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_border_radius', 'show_st'),
					brad_size = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_border_radius', 'size'),
					border_show_st = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_border', 'show_st'),
					border_color = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_border', 'color'),
					border_style = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_border', 'style'),
					border_width = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_border', 'width'),
					shadow_show_st = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_shadow', 'show_st'),
					shadow_color = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_shadow', 'color'),
					shadow_h_shadow = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_shadow', 'h_shadow'),
					shadow_v_shadow = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_shadow', 'v_shadow'),
					shadow_blur = this.getUiData6('steps_src', f_step, f_id, 'input18', 'pane_shadow', 'blur');

				if (parseInt(text_html_st) === 1) {
					obj.find('.uifm-inp31-txthtml-content').first().parent().show();
					obj.find('.uifm-inp31-txthtml-content').first().html(decodeURIComponent(text_html));
				} else {
					obj.find('.uifm-inp31-txthtml-content').first().parent().hide();
				}

				if (parseInt(marg_show_st) === 1) {
					obj
						.find('.uifm-input31-container')
						.first()
						.css('margin', marg_pos_top + 'px ' + marg_pos_right + 'px ' + marg_pos_bottom + 'px ' + marg_pos_left + 'px');
				} else {
					obj.find('.uifm-input31-container').first().removeCss('margin');
				}
				if (parseInt(pad_show_st) === 1) {
					obj
						.find('.uifm-input31-container')
						.first()
						.css('padding', pad_pos_top + 'px ' + pad_pos_right + 'px ' + pad_pos_bottom + 'px ' + pad_pos_left + 'px');
				} else {
					obj.find('.uifm-input31-container').first().removeCss('padding');
				}

				var col_block = obj.find('.uifm-inp31-txthtml-content').first().parent();
				var col_input = obj.find('.uifm-input31-main-wrap').first().parent();
				var col_block_pos = parseInt(col_block.index());

				switch (parseInt(text_html_pos)) {
					case 1:
						if (col_block_pos === 1) {
							$(col_block).insertBefore(col_input);
						}
						obj.find('.uifm-inp31-txthtml-content').first().parent().attr('class', 'rkfm-inp18-col-sm-12');
						obj.find('.uifm-inp31-txthtml-content').first().parent().siblings().attr('class', 'rkfm-inp18-col-sm-12');
						break;
					case 2:
						if (col_block_pos === 0) {
							$(col_input).insertBefore(col_block);
						}

						if (parseInt(text_html_st) === 1) {
							obj.find('.uifm-inp31-txthtml-content').first().parent().attr('class', 'rkfm-inp18-col-sm-5');
							obj.find('.uifm-inp31-txthtml-content').first().parent().siblings().attr('class', 'rkfm-inp18-col-sm-7');
						} else {
							obj.find('.uifm-inp31-txthtml-content').first().parent().siblings().attr('class', 'rkfm-inp18-col-sm-12');
						}

						break;
					case 3:
						if (col_block_pos === 0) {
							$(col_input).insertBefore(col_block);
						}
						obj.find('.uifm-inp31-txthtml-content').first().parent().attr('class', 'rkfm-inp18-col-sm-12');
						obj.find('.uifm-inp31-txthtml-content').first().parent().siblings().attr('class', 'rkfm-inp18-col-sm-12');
						break;
					case 0:
					default:
						if (col_block_pos === 1) {
							$(col_block).insertBefore(col_input);
						}

						if (parseInt(text_html_st) === 1) {
							obj.find('.uifm-inp31-txthtml-content').first().parent().attr('class', 'rkfm-inp18-col-sm-5');
							obj.find('.uifm-inp31-txthtml-content').first().parent().siblings().attr('class', 'rkfm-inp18-col-sm-7');
						} else {
							obj.find('.uifm-inp31-txthtml-content').first().parent().siblings().attr('class', 'rkfm-inp18-col-sm-12');
						}

						break;
				}

				if (parseInt(bg_show_st) === 1) {
					switch (parseInt(bg_type)) {
						case 2:
							obj
								.find('.uifm-input31-container')
								.first()
								.css({
									background: bg_start_color,
									'background-image': '-webkit-linear-gradient(top, ' + bg_start_color + ', ' + bg_end_color + ')',
									'background-image': '-moz-linear-gradient(top, ' + bg_start_color + ', ' + bg_end_color + ')',
									'background-image': '-ms-linear-gradient(top, ' + bg_start_color + ', ' + bg_end_color + ')',
									'background-image': '-o-linear-gradient(top, ' + bg_start_color + ', ' + bg_end_color + ')',
									'background-image': 'linear-gradient(to bottom, ' + bg_start_color + ',' + bg_end_color + ')'
								});

							break;
						case 1:
						default:
							if (bg_solid_color) {
								obj.find('.uifm-input31-container').first().css('background', bg_solid_color);
							}

							break;
					}

					if (bg_image) {
						obj.find('.uifm-input31-container').first().removeCss('background-image');
						obj
							.find('.uifm-input31-container')
							.first()
							.css({
								'background-image': "url('" + bg_image + "')",
								'background-repeat': 'repeat'
							});
					}
				} else {
					obj.find('.uifm-input31-container').first().removeCss('background');
					obj.find('.uifm-input31-container').first().removeCss('background-image');
				}
				if (parseInt(brad_show_st) === 1) {
					obj
						.find('.uifm-input31-container')
						.first()
						.css('border-radius', brad_size + 'px');
				} else {
					obj.find('.uifm-input31-container').first().removeCss('border-radius');
				}
				var border_sty;
				if (parseInt(border_show_st) === 1) {
					if (parseInt(border_style) === 1) {
						border_sty = 'solid ';
					} else {
						border_sty = 'dotted ';
					}
					border_sty += border_color + ' ' + border_width + 'px';
					obj.find('.uifm-input31-container').first().css('border', border_sty);
				} else {
					obj.find('.uifm-input31-container').first().removeCss('border');
				}

				var style;
				if (parseInt(shadow_show_st) === 1) {
					style = shadow_h_shadow + 'px ' + shadow_v_shadow + 'px ' + shadow_blur + 'px ' + shadow_color;
					obj.find('.uifm-input31-container').first().css('box-shadow', style);
				} else {
					obj.find('.uifm-input31-container').first().removeCss('box-shadow');
				}
			};

			arguments.callee.input17settings_preview_genAllOptions = function (obj, section) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');
				var values = this.getUiData5('steps_src', f_step, f_id, section, 'options');
				var thopt_mode = this.getUiData5('steps_src', f_step, f_id, section, 'thopt_mode') || 1;
				var f_thopt_height = this.getUiData5('steps_src', f_step, f_id, section, 'thopt_height');
				var f_thopt_width = this.getUiData5('steps_src', f_step, f_id, section, 'thopt_width');
				var f_thopt_zoom = this.getUiData5('steps_src', f_step, f_id, section, 'thopt_zoom') || 0;
				var f_thopt_usethmb = this.getUiData5('steps_src', f_step, f_id, section, 'thopt_usethmb') || 0;
				var f_thopt_showhvrtxt = this.getUiData5('steps_src', f_step, f_id, section, 'thopt_showhvrtxt') || 0;
				var f_thopt_showcheckb = this.getUiData5('steps_src', f_step, f_id, section, 'thopt_showcheckb') || 0;

				var newoptprev, newoptprev2;

				switch (parseInt(f_type)) {
					case 41:

						obj.find('.uifm-dcheckbox-group').html('');
						obj.find('.uifm-dcheckbox-group').attr('data-thopt-height', f_thopt_height);
						obj.find('.uifm-dcheckbox-group').attr('data-thopt-width', f_thopt_width);
						obj.find('.uifm-dcheckbox-group').attr('data-opt-laymode', thopt_mode);
						obj.find('.uifm-dcheckbox-group').attr('data-thopt-zoom', f_thopt_zoom);
						obj.find('.uifm-dcheckbox-group').attr('data-thopt-showhvrtxt', f_thopt_showhvrtxt);
						obj.find('.uifm-dcheckbox-group').attr('data-thopt-showcheckb', f_thopt_showcheckb);

						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item').clone();
							newoptprev.attr('data-inp17-opt-index', index);
							obj.find('.uifm-dcheckbox-group').append(newoptprev);

							rocketform.input17settings_preview_setOption(newoptprev, index, 'label', null, null, value['label']);
							rocketform.input17settings_preview_setOption(newoptprev, index, 'checked', null, null, value['checked']);
							rocketform.input17settings_preview_setOption(newoptprev, index, 'price', null, null, value['price']);
							rocketform.input17settings_preview_setOption(newoptprev, index, 'qty_st', null, null, value['qty_st']);
							rocketform.input17settings_preview_setOption(newoptprev, index, 'qty_max', null, null, value['qty_max']);

							newoptprev.find('.uifm-dcheckbox-label').hide();
							newoptprev.find('.uifm-dcheckbox-label').html(value['label']);
							newoptprev.find('.uifm-dcheckbox-label').css('width', f_thopt_width);

							switch (parseInt(f_thopt_showhvrtxt)) {
								case 3:
									newoptprev.find('.uifm-dcheckbox-label-up').show();
									break;
								case 2:
									newoptprev.find('.uifm-dcheckbox-label-below').show();
									break;
							}

							switch (parseInt(thopt_mode)) {
								case 2:
									if (value['img_list_2']) {
										$.each(value['img_list_2'], function (index2, value2) {
											newoptprev2 = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item-imgsrc').clone();
											newoptprev2.attr('data-inp17-opt2-index', index2);
											newoptprev.find('.uifm-dcheckbox-item-gal-imgs').append(newoptprev2);
											rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list_2', index2, 'img_full', value2['img_full']);
										});
									}
									break;
								case 1:
								default:
									if (value['img_list']) {
										$.each(value['img_list'], function (index2, value2) {
											newoptprev2 = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item-imgsrc').clone();
											newoptprev2.attr('data-inp17-opt2-index', index2);
											newoptprev.find('.uifm-dcheckbox-item-gal-imgs').append(newoptprev2);
											rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list', index2, 'title', value2['title']);
											rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list', index2, 'img_full', value2['img_full']);
											if (parseInt(f_thopt_usethmb) === 1) {
												rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list', index2, 'img_th_150x150', value2['img_th_150x150']);
											} else {
												rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list', index2, 'img_th_150x150', value2['img_full']);
											}
										});
									}
							}
						});

						obj.find('.uifm-dcheckbox-item').uiformDCheckbox();
						break;
					case 42:
						obj.find('.uifm-dradiobtn-group').html('');
						obj.find('.uifm-dradiobtn-group').attr('data-thopt-height', f_thopt_height);
						obj.find('.uifm-dradiobtn-group').attr('data-thopt-width', f_thopt_width);
						obj.find('.uifm-dradiobtn-group').attr('data-opt-laymode', thopt_mode);
						obj.find('.uifm-dradiobtn-group').attr('data-thopt-zoom', f_thopt_zoom);
						obj.find('.uifm-dradiobtn-group').attr('data-thopt-showhvrtxt', f_thopt_showhvrtxt);
						obj.find('.uifm-dradiobtn-group').attr('data-thopt-showcheckb', f_thopt_showcheckb);

						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp17_templates').find('.uifm-dradiobtn-item').clone();
							newoptprev.attr('data-inp17-opt-index', index);
							obj.find('.uifm-dradiobtn-group').append(newoptprev);

							rocketform.input17settings_preview_setOption(newoptprev, index, 'label', null, null, value['label']);
							rocketform.input17settings_preview_setOption(newoptprev, index, 'checked', null, null, value['checked']);
							rocketform.input17settings_preview_setOption(newoptprev, index, 'price', null, null, value['price']);
							rocketform.input17settings_preview_setOption(newoptprev, index, 'qty_st', null, null, value['qty_st']);
							rocketform.input17settings_preview_setOption(newoptprev, index, 'qty_max', null, null, value['qty_max']);

							newoptprev.find('.uifm-dcheckbox-label').hide();
							newoptprev.find('.uifm-dcheckbox-label').html(value['label']);
							newoptprev.find('.uifm-dcheckbox-label').css('width', f_thopt_width);

							switch (parseInt(f_thopt_showhvrtxt)) {
								case 3:
									newoptprev.find('.uifm-dcheckbox-label-up').show();
									break;
								case 2:
									newoptprev.find('.uifm-dcheckbox-label-below').show();
									break;
							}

							switch (parseInt(thopt_mode)) {
								case 2:
									if (value['img_list_2']) {
										$.each(value['img_list_2'], function (index2, value2) {
											newoptprev2 = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item-imgsrc').clone();
											newoptprev2.attr('data-inp17-opt2-index', index2);
											newoptprev.find('.uifm-dcheckbox-item-gal-imgs').append(newoptprev2);
											rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list_2', index2, 'img_full', value2['img_full']);
										});
									}
									break;
								case 1:
								default:
									if (value['img_list']) {
										$.each(value['img_list'], function (index2, value2) {
											newoptprev2 = $('#uifm_frm_inp17_templates').find('.uifm-dcheckbox-item-imgsrc').clone();
											newoptprev2.attr('data-inp17-opt2-index', index2);
											newoptprev.find('.uifm-dcheckbox-item-gal-imgs').append(newoptprev2);
											rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list', index2, 'title', value2['title']);
											rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list', index2, 'img_full', value2['img_full']);
											if (parseInt(f_thopt_usethmb) === 1) {
												rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list', index2, 'img_th_150x150', value2['img_th_150x150']);
											} else {
												rocketform.input17settings_preview_setOption(newoptprev2, index, 'img_list', index2, 'img_th_150x150', value2['img_full']);
											}
										});
									}
							}
						});
						obj.find('.uifm-dradiobtn-item').uiformDCheckbox();
						break;
				}


				if (parseInt(f_thopt_zoom) === 0) {
					obj.find('.uifm-dcheckbox-item-showgallery').hide();
				}
			};

			arguments.callee.inputsettings_addingPrepAppe = function (element) {
				var el = $(element);
				var option = el.data('option');
				var sourcetxt = el.data('source-txt');
				var mainpos = el.data('pos');
				var newdata;
				var f_val;
				switch (parseInt(mainpos)) {
					case 1:
						switch (parseInt(option)) {
							case 1:
								newdata = $('#' + sourcetxt).val();
								$('#uifm_fld_input_prep_preview').append(newdata);
								break;
							case 2:
							case 3:
								newdata = $('#' + sourcetxt)
									.find('i')
									.first()
									.clone();
								$('#uifm_fld_input_prep_preview').append(newdata);
								break;
							case 4:
								$('#uifm_fld_input_prep_preview').html('');
								break;
						}
						f_val = $('#uifm_fld_input_prep_preview').html() ? encodeURIComponent($('#uifm_fld_input_prep_preview').html()) : '';

						break;
					case 2:
						switch (parseInt(option)) {
							case 1:
								newdata = $('#' + sourcetxt).val();
								$('#uifm_fld_input_appe_preview').append(newdata);
								break;
							case 2:
							case 3:
								newdata = $('#' + sourcetxt)
									.find('i')
									.first()
									.clone();
								$('#uifm_fld_input_appe_preview').append(newdata);
								break;
							case 4:
								$('#uifm_fld_input_appe_preview').html('');
								break;
						}
						f_val = $('#uifm_fld_input_appe_preview').html() ? encodeURIComponent($('#uifm_fld_input_appe_preview').html()) : '';
						break;
				}

				var f_id = $('#uifm-field-selected-id').val();
				var store = el.data('field-store');

				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');

				rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
				var obj_field = $('#' + f_id);
				if (obj_field) {
					rocketform.setDataOptToPrevField(obj_field, store, f_val);
				}
			};

			arguments.callee.previewfield_prepappTxtOnInput = function (obj, option) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var cus_data, class_find, inp_opt;

				switch (option) {
					case 'prepe_txt':
						inp_opt = 'prepe_txt';
						class_find = '.uifm-inp-preptxt';
						break;
					case 'append_txt':
						inp_opt = 'append_txt';
						class_find = '.uifm-inp-apptxt';
						break;
				}
				cus_data = decodeURIComponent(rocketform.getUiData5('steps_src', parseInt(f_step), f_id, 'input', inp_opt));
				obj.find(class_find).html(cus_data);
			};

			arguments.callee.input5settings_loadRecaptcha = function (id, key_public, theme) {
				try {
					if (key_public) {
						grecaptcha.render(id, {
							sitekey: key_public,
							theme: theme
						});
					}
				} catch (ex) {
					console.error('input5settings_loadRecaptcha error : ', ex.message);
				}
			};
			arguments.callee.input6settings_refreshCaptcha = function (element) {
				var el = $(element);

				var obj_field = el.closest('.uiform-field');

				var f_id = obj_field.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var txt_color_st = this.getUiData5('steps_src', f_step, f_id, 'input6', 'txt_color_st');
				var txt_color = this.getUiData5('steps_src', f_step, f_id, 'input6', 'txt_color');
				var background_st = this.getUiData5('steps_src', f_step, f_id, 'input6', 'background_st');
				var background_color = this.getUiData5('steps_src', f_step, f_id, 'input6', 'background_color');
				var distortion = this.getUiData5('steps_src', f_step, f_id, 'input6', 'distortion');
				var behind_lines_st = this.getUiData5('steps_src', f_step, f_id, 'input6', 'behind_lines_st');
				var behind_lines = this.getUiData5('steps_src', f_step, f_id, 'input6', 'behind_lines');
				var front_lines_st = this.getUiData5('steps_src', f_step, f_id, 'input6', 'front_lines_st');
				var front_lines = this.getUiData5('steps_src', f_step, f_id, 'input6', 'front_lines');

				var el_url = obj_field.find('.uifm-inp6-wrap-refrescaptcha a').data('rkurl');

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/fields/ajax_refresh_captcha',
					dataType: 'json',
					data: {
						action: 'rocket_backend_refreshcaptcha',
						txt_color_st: txt_color_st,
						txt_color: txt_color,
						background_st: background_st,
						background_color: background_color,
						distortion: distortion,
						behind_lines_st: behind_lines_st,
						behind_lines: behind_lines,
						front_lines_st: front_lines_st,
						front_lines: front_lines,
						zgfm_security: uiform_vars.ajax_nonce,
						page: 'zgfm_form_builder',
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (response) {
						obj_field.find('.uifm-inp6-captcha-img').attr('src', el_url + response.rkver);
						obj_field.find('.uifm-inp6-wrap-refrescaptcha a').attr('data-rkver', response.rkver);
					}
				});
			};
			arguments.callee.input11settings_updateField = function (obj, section, option) {
				try {
					var f_id = obj.attr('id');
					var f_step = $('#' + f_id)
						.closest('.uiform-step-pane')
						.data('uifm-step');
					var f_inp;
					var f_div_color = this.getUiData5('steps_src', f_step, f_id, section, 'div_color') || '';
					var f_div_col_st = this.getUiData5('steps_src', f_step, f_id, section, 'div_col_st');
					var f_text_color = this.getUiData5('steps_src', f_step, f_id, section, 'text_color');
					var f_text_val = this.getUiData5('steps_src', f_step, f_id, section, 'text_val');

					var border_focus_str;

					if (f_div_color.length && parseInt(f_div_col_st) === 1) {
						if ($('#' + f_id)) {
							$('#' + f_id + '_prev_fld_divider').remove();
							border_focus_str = '<style type="text/css" id="' + f_id + '_prev_fld_divider">';
							border_focus_str += '#' + f_id + ' .uiform-divider-text::before {';
							border_focus_str += 'background:' + f_div_color + '!important;';
							border_focus_str += '} ';
							border_focus_str += '#' + f_id + ' .uiform-divider-text::after {';
							border_focus_str += 'background:' + f_div_color + '!important;';
							border_focus_str += '} ';
							border_focus_str += '</style>';
							$('head').append(border_focus_str);
						}
					} else {
						$('#' + f_id + '_prev_fld_divider').remove();
					}

					obj.find('.uiform-divider-text').css('color', f_text_color);

					if (parseInt(f_text_val.length) != 0) {
						obj.find('.uiform-divider-text').show().html(f_text_val);
					} else {
						obj.find('.uiform-divider-text').hide();
					}

					rocketform.previewform_elementBackground($('.uiform-main-form'), false);
				} catch (ex) {
					console.error('input11settings_updateField error : ', ex.message);
				}
			};
			arguments.callee.input9settings_updateField = function (obj, section) {
				var f_type = obj.data('typefield');
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_inp;
				var f_txt1 = this.getUiData5('steps_src', f_step, f_id, section, 'txt_star1');
				var f_txt2 = this.getUiData5('steps_src', f_step, f_id, section, 'txt_star2');
				var f_txt3 = this.getUiData5('steps_src', f_step, f_id, section, 'txt_star3');
				var f_txt4 = this.getUiData5('steps_src', f_step, f_id, section, 'txt_star4');
				var f_txt5 = this.getUiData5('steps_src', f_step, f_id, section, 'txt_star5');
				var f_txtnorate = this.getUiData5('steps_src', f_step, f_id, section, 'txt_norate');

				f_inp = obj.find('.uifm-input-ratingstar');
				if (!f_inp.data('rating')) {
					$(f_inp).rating({
						starCaptions: { 1: f_txt1, 2: f_txt2, 3: f_txt3, 4: f_txt4, 5: f_txt5 },
						clearCaption: f_txtnorate,
						starCaptionClasses: { 1: 'text-danger', 2: 'text-warning', 3: 'text-info', 4: 'text-primary', 5: 'text-success' }
					});
				} else {
					$(f_inp).rating('refresh', { starCaptions: { 1: f_txt1, 2: f_txt2, 3: f_txt3, 4: f_txt4, 5: f_txt5 }, clearCaption: f_txtnorate });
				}
			};
			arguments.callee.input7settings_updateField = function (obj, section, option) {
				var f_type = obj.data('typefield');
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var f_inp;

				var f_language = this.getUiData5('steps_src', f_step, f_id, section, 'language');
				var f_format = this.getUiData5('steps_src', f_step, f_id, section, 'format');
				switch (parseInt(f_type)) {
					case 24:
						f_inp = obj.find('.uifm-input7-datepic');
						if (!f_inp.data('DateTimePicker')) {
							f_inp.datetimepicker({
								format: 'L'
							});
						}

						if (f_language) {
							f_inp.data('DateTimePicker').locale(f_language);
						}

						if (f_format) {
							f_inp.data('DateTimePicker').dayViewHeaderFormat(f_format);
							f_inp.data('DateTimePicker').format(f_format);
						}

						break;
					case 25:
						f_inp = obj.find('.uifm-input7-timepic');
						if (!f_inp.data('DateTimePicker')) {
							f_inp.datetimepicker({
								format: 'LT'
							});
						}
						break;
					case 26:
						f_inp = obj.find('.uifm-input7-datetimepic');
						if (!f_inp.data('DateTimePicker')) {
							f_inp.datetimepicker();
						}
						if (f_language) {
							f_inp.data('DateTimePicker').locale(f_language);
						} else {
							f_inp.data('DateTimePicker').locale('en');
						}
						if (f_format) {
							f_inp.data('DateTimePicker').dayViewHeaderFormat(f_format);
						}
						break;
				}
			};

			arguments.callee.input6settings_checkCaptcha = function (obj, section, option) {
				if (parseInt($('.uiform-main-form').find('.uiform-captcha').length) != 0) {
					var rockfm_rcha_d = $('.uiform-main-form').find('.uifm-inp6-captcha');
					if (parseInt(rockfm_rcha_d.length) > 1) {
						rockfm_rcha_d.each(function (i) {
							if (parseInt(i) != 0) {
								$(this).removeClass('uifm-inp6-captcha').html('Captcha is loaded once. Remove this field');
							}
						});
					}

					var f_id = obj.attr('id');
					var f_step = $('#' + f_id)
						.closest('.uiform-step-pane')
						.data('uifm-step');
					var txt_color_st = this.getUiData5('steps_src', f_step, f_id, section, 'txt_color_st');
					var txt_color = this.getUiData5('steps_src', f_step, f_id, section, 'txt_color');
					var background_st = this.getUiData5('steps_src', f_step, f_id, section, 'background_st');
					var background_color = this.getUiData5('steps_src', f_step, f_id, section, 'background_color');
					var distortion = this.getUiData5('steps_src', f_step, f_id, section, 'distortion');
					var behind_lines_st = this.getUiData5('steps_src', f_step, f_id, section, 'behind_lines_st');
					var behind_lines = this.getUiData5('steps_src', f_step, f_id, section, 'behind_lines');
					var front_lines_st = this.getUiData5('steps_src', f_step, f_id, section, 'front_lines_st');
					var front_lines = this.getUiData5('steps_src', f_step, f_id, section, 'front_lines');

					var f_values = this.getUiData4('steps_src', f_step, f_id, section);

					var valhash = CryptoJS.MD5(JSON.stringify(f_values));

					var f_checkhash = $('#' + f_id)
						.find('.uifm-inp6-captcha-inputcode')
						.attr('data-check-hash');

					if (String(f_checkhash) === String(valhash)) {
					} else {
						$('#' + f_id)
							.find('.uifm-inp6-captcha-inputcode')
							.attr('data-check-hash', valhash);

						var el_url = obj.find('.uifm-inp6-wrap-refrescaptcha a').data('rkurl');

						$.ajax({
							type: 'POST',
							url: rockfm_vars.uifm_siteurl + 'formbuilder/fields/ajax_refresh_captcha',
							dataType: 'json',
							data: {
								action: 'rocket_backend_refreshcaptcha',
								txt_color_st: txt_color_st,
								txt_color: txt_color,
								background_st: background_st,
								background_color: background_color,
								distortion: distortion,
								behind_lines_st: behind_lines_st,
								behind_lines: behind_lines,
								front_lines_st: front_lines_st,
								front_lines: front_lines,
								page: 'zgfm_form_builder',
								csrf_field_name: uiform_vars.csrf_field_name
							},
							success: function (response) {
								obj.find('.uifm-inp6-captcha-img').attr('src', el_url + response.rkver);
								obj.find('.uifm-inp6-wrap-refrescaptcha a').attr('data-rkver', response.rkver);
							}
						});
					}
				}
			};

			arguments.callee.input5settings_checkRecaptcha = function (obj, section, option) {
				if (parseInt($('.uiform-main-form').find('.uifm-input-recaptcha').length) > 0) {
					var uifm_rec_el;
					var rockfm_rcha_d = $('.uiform-main-form').find('.uifm-input-recaptcha');
					if (parseInt(rockfm_rcha_d.length) > 1) {
						rockfm_rcha_d.each(function (i) {
							if (parseInt(i) != 0) {
								$(this).removeClass('g-recaptcha').html('ReCaptcha is loaded once. Remove this field');
							} else {
								uifm_rec_el = $(this);
							}
						});
					} else {
						uifm_rec_el = rockfm_rcha_d;
					}

					var f_id = obj.attr('id');
					var f_step = $('#' + f_id)
						.closest('.uiform-step-pane')
						.data('uifm-step');
					var f_key_public = this.getUiData5('steps_src', f_step, f_id, 'input5', 'g_key_public');
					var f_theme = this.getUiData5('steps_src', f_step, f_id, section, 'g_theme');

					$('#uifmobj-' + f_id).html('');

					var f_theme_name;
					switch (parseInt(f_theme)) {
						case 1:
							f_theme_name = 'dark';
							$('#uifmobj-' + f_id).html('<img src="' + uiform_vars.url_assets + '/backend/img/uifm_field_recaptcha_prev_black_img.png" />');
							break;
						default:
							$('#uifmobj-' + f_id).html('<img src="' + uiform_vars.url_assets + '/backend/img/uifm_field_recaptcha_prev_white_img.png" />');
							f_theme_name = 'light';
							break;
					}

				}

			};

			arguments.callee.clogic_getListField = function (logic_row) {
				var field = $('#uiform-set-clogic-tmpl .uifm_clogic_fieldsel').clone();
				var var_fields = this.getUiData('steps_src');
				var val_selected = $('#uifm-field-selected-id').val();
				var arr_types_allowed = [8, 9, 10, 11, 16, 18, 40, 41, 42];
				var string_res = '';
				$.each(var_fields, function (index, value) {
					$.each(value, function (index2, value2) {
						if (String(val_selected) != String(value2.id) && $.inArray(parseInt(value2.type), arr_types_allowed) >= 0) {
							string_res += '<option data-type="' + value2.type + '" value="' + value2.id + '">' + value2.field_name + '</option>';
						}
					});
				});
				field.append(string_res);
				logic_row.find('.uifm_clogic_field').append(field);
				logic_row.find('.uifm_clogic_fieldsel').chosen({ width: '100%' });
			};

			arguments.callee.search_fieldById = function (field_id) {
				var var_fields = this.getUiData('steps_src');
				for (var i in var_fields) {
					for (var i2 in var_fields[i]) {
						if (String(var_fields[i][i2].id) === String(field_id)) {
							return var_fields[i][i2];
						}
					}
				}
				return false;
			};
			arguments.callee.viewchart_load = function () {
				var idform = $('#uifm-record-form-cmb').val();
				rocketform.showLoader(1, true, true);
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/records/ajax_load_viewchart',
					data: {
						action: 'rocket_fbuilder_loadchart_byform',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						form_id: parseInt(idform),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						$('#uiform-viewchart-result').html('');
						rocketform.viewchart_generate(msg.data);
						rocketform.hideLoader();
					}
				});
			};

			arguments.callee.viewchart_generate = function (response) {
				try {
					Morris.Area({
						element: 'uiform-viewchart-result',
						data: response,
						xkey: 'days',
						ykeys: ['requests'],
						labels: ['requests'],
						smooth: false
					});
				} catch (err) {
					console.log('error viewchart_refresh: ' + err.message);
				}
			};
			arguments.callee.clogic_getTypeMatch = function (logic_row, type) {
				logic_row.find('.uifm_clogic_mtype').html('');
				logic_row.find('.uifm_clogic_mtype').attr('data-loaded', '0');
				logic_row.find('.uifm_clogic_mtype').append('<i class="sfdc-glyphicon sfdc-glyphicon-refresh sfdc-gly-spin sfdc-spin1"></i>');

				logic_row.find('.uifm_clogic_mtype').find('.sfdc-gly-spin').fadeOut('slow').remove();

				var str;
				switch (parseInt(type)) {
					case 8:
					case 9:
					case 10:
					case 11:
					case 40:
					case 41:
					case 42:
						str = $('#uiform-set-clogic-tmpl .uifm_clogic_mtypeinp_1').clone();
						break;
					case 16:
					case 18:
						str = $('#uiform-set-clogic-tmpl .uifm_clogic_mtypeinp_2').clone();
						break;
				}

				logic_row.find('.uifm_clogic_mtype').append(str);
				logic_row.find('.uifm_clogic_mtypeinp').chosen({ width: '100%' });
				logic_row.find('.uifm_clogic_mtype').attr('data-loaded', '1');
			};

			arguments.callee.clogic_getMatchInput = function (logic_row, field) {
				logic_row.find('.uifm_clogic_minput').html('');
				logic_row.find('.uifm_clogic_minput').attr('data-loaded', '0');
				logic_row.find('.uifm_clogic_minput').append('<i class="sfdc-glyphicon sfdc-glyphicon-refresh sfdc-gly-spin sfdc-spin1"></i>');

				logic_row.find('.uifm_clogic_minput').find('.sfdc-gly-spin').fadeOut('slow').remove();

				var str;
				var str_opts;
				var tmp_opts;
				switch (parseInt(field.type)) {
					case 8:
					case 9:
					case 10:
					case 11:
						str = $('#uiform-set-clogic-tmpl .uifm_clogic_minput_1').clone();
						tmp_opts = field.input2['options'];
						if (tmp_opts) {
							str_opts = '';
							$.each(tmp_opts, function (index2, value2) {
								str_opts += '<option value="' + index2 + '">' + value2.value + '</option>';
							});
							str.append(str_opts);
						}
						logic_row.find('.uifm_clogic_minput').append(str);
						logic_row.find('.uifm_clogic_minput_1').chosen({ width: '100%' });
						break;

					case 42:
					case 41:
						str = $('#uiform-set-clogic-tmpl .uifm_clogic_minput_1').clone();
						tmp_opts = field.input17['options'];
						if (tmp_opts) {
							str_opts = '';
							$.each(tmp_opts, function (index2, value2) {
								str_opts += '<option value="' + index2 + '">' + value2.label + '</option>';
							});
							str.append(str_opts);
						}
						logic_row.find('.uifm_clogic_minput').append(str);
						logic_row.find('.uifm_clogic_minput_1').chosen({ width: '100%' });
						break;
					case 40:
						str = $('#uiform-set-clogic-tmpl .uifm_clogic_minput_1').clone();

						str_opts = '';
						str_opts += '<option value="0">' + field.input15['txt_no'] + '</option>';
						str_opts += '<option value="1">' + field.input15['txt_yes'] + '</option>';

						str.append(str_opts);

						logic_row.find('.uifm_clogic_minput').append(str);
						logic_row.find('.uifm_clogic_minput_1').chosen({ width: '100%' });

						break;

					case 16:
					case 18:
						str = $('#uiform-set-clogic-tmpl .uifm_clogic_minput_2').clone();
						var set_min = field.input4['set_min'],
							set_max = field.input4['set_max'],
							set_default = field.input4['set_default'],
							set_step = field.input4['set_step'];
						logic_row.find('.uifm_clogic_minput').append(str);
						logic_row.find('.uifm_clogic_minput_2').TouchSpin({
							verticalbuttons: true,
							min: parseFloat(set_min),
							max: parseFloat(set_max),
							stepinterval: parseFloat(set_step),
							verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
							verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus',
							initval: parseFloat(set_default)
						});
						break;
				}
				logic_row.find('.uifm_clogic_minput').attr('data-loaded', '1');
			};
			arguments.callee.clogic_changeMtype = function (elm) {
				var el = $(elm);
				var el_row = el.closest('.uifm-conditional-row');
				var cl_sel_mtype = el_row.find('.uifm_clogic_mtype select').chosen().val();
				var optnro = el_row.data('row-index');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'clogic', 'list', parseInt(optnro), 'mtype', cl_sel_mtype);
			};
			arguments.callee.clogic_changeMinput = function (elm) {
				var el = $(elm);
				var el_row = el.closest('.uifm-conditional-row');
				var optnro = el_row.data('row-index');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var cl_sel_id = el_row.find('.uifm_clogic_fieldsel').chosen().val();
				var type = el_row.find('.uifm_clogic_fieldsel [value="' + cl_sel_id + '"]').data('type');
				var cl_sel_minput;
				switch (parseInt(type)) {
					case 8:
					case 9:
					case 10:
					case 11:
					case 40:
					case 41:
					case 42:
						cl_sel_minput = el_row.find('.uifm_clogic_minput_1').chosen().val();

						break;
					case 16:
					case 18:
						cl_sel_minput = el_row.find('.uifm_clogic_minput_2').val();
						break;
				}

				rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'clogic', 'list', parseInt(optnro), 'minput', cl_sel_minput);
			};
			arguments.callee.clogic_deleteConditional = function (elm) {
				var el = $(elm);
				var f_id = $('#uifm-field-selected-id').val();
				var opt_index = el.closest('.uifm-conditional-row').data('row-index');

				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');

				el.closest('.uifm-conditional-row').remove();
				rocketform.delUiData6('steps_src', parseInt(f_step), f_id, 'clogic', 'list', parseInt(opt_index));
				var tmp_arr = mainrformb['steps_src'][parseInt(f_step)][f_id]['clogic']['list'];
				var tmp_len = tmp_arr.length,
					tmp_i;
				for (tmp_i = 0; tmp_i < tmp_len; tmp_i++) tmp_arr[tmp_i] && tmp_arr.push(tmp_arr[tmp_i]);
				if ($.isArray(tmp_arr)) {
					tmp_arr.splice(0, tmp_len);
					mainrformb['steps_src'][parseInt(f_step)][f_id]['clogic']['list'] = tmp_arr;
				}
			};

			arguments.callee.clogic_changeField = function (elm) {
				var el = $(elm);
				var el_row = el.closest('.uifm-conditional-row');
				var f_id = $('#uifm-field-selected-id').val();
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				var optnro = el_row.data('row-index');
				var row_field_val = el_row.find('.uifm_clogic_fieldsel').chosen().val();

				var field = this.search_fieldById(row_field_val);

				this.clogic_getTypeMatch(el_row, field.type);

				var uifm_check_timer = setInterval(function () {
					if (parseInt(el_row.find('.uifm_clogic_mtype').attr('data-loaded')) === 1) {
						var cl_sel_mtype = el_row.find('.uifm_clogic_mtype select').chosen().val();


						rocketform.clogic_getMatchInput(el_row, field);

						var uifm_check2_timer = setInterval(function () {
							if (parseInt(el_row.find('.uifm_clogic_minput').attr('data-loaded')) === 1) {
								var cl_sel_minput;
								switch (parseInt(field.type)) {
									case 8:
									case 9:
									case 10:
									case 11:
									case 41:
									case 42:
										cl_sel_minput = el_row.find('.uifm_clogic_minput_1').chosen().val();
										break;
									case 40:
									case 16:
									case 18:
										cl_sel_minput = el_row.find('.uifm_clogic_minput_2').val();
										break;
								}

								var tmp_list = rocketform.getUiData5('steps_src', parseInt(f_step), f_id, 'clogic', 'list');

								if (tmp_list) {
									$.each(tmp_list, function (index, value) {
										if (String(value) === '' || value === null) {
											tmp_list.splice(index, 1);
										}
									});
								}

								rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'clogic', 'list', parseInt(optnro), 'field_fire', row_field_val);
								rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'clogic', 'list', parseInt(optnro), 'mtype', cl_sel_mtype);
								rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'clogic', 'list', parseInt(optnro), 'minput', cl_sel_minput);

								clearInterval(uifm_check2_timer);
								uifm_check2_timer = null;
							}
						}, 500);

						clearInterval(uifm_check_timer);
						uifm_check_timer = null;
					}
				}, 500);
			};
			arguments.callee.clogic_addNewConditional = function () {
				var logic_cont = $('#uifm-conditional-logic-list');

				var num = $('#uifm-conditional-logic-list .uifm-conditional-row').length;
				var optindex = parseInt(num);
				var f_id = $('#uifm-field-selected-id').val();
				var logic_row = $('#uiform-set-clogic-tmpl .uifm-conditional-row').clone();
				logic_row.attr('data-row-index', optindex);
				logic_cont.append(logic_row);

				rocketform.clogic_getListField(logic_row);

				var cl_sel_id = logic_row.find('.uifm_clogic_fieldsel').chosen().val();
				var field = rocketform.search_fieldById(cl_sel_id);


				this.clogic_getTypeMatch(logic_row, field.type);

				var uifm_check_timer = setInterval(function () {
					if (parseInt(logic_row.find('.uifm_clogic_mtype').attr('data-loaded')) === 1) {
						var cl_sel_mtype = logic_row.find('.uifm_clogic_mtype select').chosen().val();


						rocketform.clogic_getMatchInput(logic_row, field);

						var uifm_check2_timer = setInterval(function () {
							if (parseInt(logic_row.find('.uifm_clogic_minput').attr('data-loaded')) === 1) {
								var cl_sel_minput;
								switch (parseInt(field.type)) {
									case 8:
									case 9:
									case 10:
									case 11:
									case 41:
									case 42:
										cl_sel_minput = logic_row.find('.uifm_clogic_minput_1').chosen().val();
										break;
									case 40:
									case 16:
									case 18:
										cl_sel_minput = logic_row.find('.uifm_clogic_minput_2').val();
										break;
								}

								var f_step = $('#' + f_id)
									.closest('.uiform-step-pane')
									.data('uifm-step');

								var tmp_list = rocketform.getUiData5('steps_src', parseInt(f_step), f_id, 'clogic', 'list');

								if (tmp_list) {
									$.each(tmp_list, function (index, value) {
										if (String(value) === '' || value === null) {
											tmp_list.splice(index, 1);
										}
									});
								}

								rocketform.setUiData5('steps_src', parseInt(f_step), f_id, 'clogic', 'list', tmp_list);

								rocketform.addIndexUiData5('steps_src', parseInt(f_step), f_id, 'clogic', 'list', parseInt(optindex));
								rocketform.setUiData6('steps_src', parseInt(f_step), f_id, 'clogic', 'list', parseInt(optindex), { field_fire: cl_sel_id, mtype: cl_sel_mtype, minput: cl_sel_minput });

								clearInterval(uifm_check2_timer);
								uifm_check2_timer = null;
							}
						}, 500);

						clearInterval(uifm_check_timer);
						uifm_check_timer = null;
					}
				}, 500);
			};
			arguments.callee.fieldQuickOptions_selectField = function (id_field) {
				var el = $('#' + id_field);
				var quopts = el.find('.uiform-fields-quick-options');
				if (quopts.find('.uiform-fields-qopt-select input').is(':checked')) {
					quopts.css('display', 'block');
				} else {
					quopts.removeCss('display');
				}
				this.fieldQuickOptions_selectField_showTabs();
			};

			arguments.callee.fieldQuickOptions_selectField_showTabs = function () {
				var numChecked = $('.uiform-main-form .uiform-fields-qopt-select input:checked').length;

				if (parseInt(numChecked) === 1) {
					rocketform.fieldQuickOptions_selectField_equalToOne();
				} else if (parseInt(numChecked) > 1) {

					rocketform.fieldQuickOptions_selectField_MoreThanOne();
				} else {


					rocketform.closeSettingTab();
					if ($(document).find('.uifm-highlight-edited')) {
						$(document).find('.uifm-highlight-edited').removeClass('uifm-highlight-edited');
					}
				}
			};
			arguments.callee.fieldQuickOptions_EditField = function (el) {
				var pickfield = $(el).closest('.zgpb-fields-quick-options2').parent();
				if (parseInt($('.uiform-main-form .uiform-fields-qopt-select input:checked').length) > 0) {
					$('.uiform-main-form .uiform-fields-qopt-select input:checked').prop('checked', false);
				}
				$('.uiform-main-form .uiform-fields-qopt-select input').closest('.uiform-fields-quick-options').removeCss('display');

				rocketform.previewfield_hidePopOver();
				rocketform.previewfield_helpblock_hidetooltip();

				rocketform.fieldQuickOptions_loadFieldSelected(pickfield);
			};


			arguments.callee.fields2_fieldQuickOptions_EditField = function (element, ismain) {
				$('#zgpb-editor-container .zgpb-fl-gs-block-style-hover').removeClass('zgpb-fl-gs-block-style-hover');

				var el = $(element),
					type = el.closest('.zgpb-field-template').attr('data-typefield'),
					id = el.closest('.zgpb-field-template').attr('id'),
					addt = [];

				var step_pane;
				var tmp_fld_load = [];
				switch (parseInt(type)) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						if (ismain) {
							addt['block'] = 0;
						} else {
							var block = el.closest('.zgpb-fl-gs-block-style').attr('data-zgpb-blocknum') || 0;
							addt['block'] = block;
						}

						step_pane = $('#' + id)
							.closest('.uiform-step-pane')
							.data('uifm-step');

						rocketform.enableSettingTabOnPick(id, type);

						tmp_fld_load['id'] = id;
						tmp_fld_load['typefield'] = type;
						tmp_fld_load['step_pane'] = step_pane;
						tmp_fld_load['addt'] = addt;
						tmp_fld_load['oncreation'] = false;

						rocketform.loadFieldSettingTab(tmp_fld_load);

						break;
					default:
						(el = $(element)), (type = el.closest('.uiform-field').attr('data-typefield')), (id = el.closest('.uiform-field').attr('id')), (addt = []);

						step_pane = $('#' + id)
							.closest('.uiform-step-pane')
							.data('uifm-step');
						rocketform.enableSettingTabOnPick(id, type);

						tmp_fld_load['id'] = id;
						tmp_fld_load['typefield'] = type;
						tmp_fld_load['step_pane'] = step_pane;
						tmp_fld_load['addt'] = addt;
						tmp_fld_load['oncreation'] = false;

						rocketform.loadFieldSettingTab(tmp_fld_load);

						rocketform.setHighlightPicked($('#' + id));
						break;
				}
			};

			arguments.callee.fields2_fieldQuickOptions_DuplicateField = function (id) {
				rocketform.setInnerVariable('fields_load_settings', 2);

				var pickfield = $('#' + id);
				var pickfield_type = pickfield.attr('data-typefield');

				var f_step = $('.uiform-step-content .uiform-step-pane:visible').data('uifm-step');

				var values_tmp, el_container, el_id, el_children_count, el_children, children_tmp_a, children_tmp_ob, child_id, check_field;

				values_tmp = {};
				el_container = pickfield.data('iscontainer') ? pickfield.data('iscontainer') : 0;
				values_tmp.iscontainer = parseInt(el_container);

				values_tmp.num_tab = 0;
				values_tmp.type = pickfield_type;

				values_tmp.id = id;

				if (el_container === 1) {
					rocketform.setInnerVariable('fields_flag_stored', []);


					el_children_count = pickfield.find('.zgpb-field-template').length;
					values_tmp.count_children = parseInt(el_children_count);
					el_children = pickfield.find('.zgpb-field-template') || null;
					if (parseInt(el_children_count) > 0) {
						children_tmp_a = [];
						$(el_children).each(function (index2, element2) {
							child_id = $(this).attr('id') ? $(this).attr('id') : 0;
							children_tmp_a.push(child_id);
						});
						values_tmp.children_str = children_tmp_a.join(',');
					}

					values_tmp.inner = rocketform.getLayoutFormByStep_checkChildren(id, el_children, pickfield_type, pickfield, f_step);

					rocketform.setInnerVariable('fields_duplication_stored', values_tmp);


					rocketform.fields2_fieldQuickOptions_Duplicate_process(pickfield, pickfield_type);
				} else {
					var sel_element = $('.uiform-enable-fieldset').find('a[data-type="' + pickfield_type + '"]');
					var el = $(sel_element).clone();
					el.insertAfter(pickfield);


					var new_parent_id = rocketform.getFieldsAfterDraggable(el, pickfield_type, true, pickfield.attr('id'));
				}

				setTimeout(function () {
					rocketform.setInnerVariable('fields_load_settings', 1);
				}, 1000);
			};

			arguments.callee.fields2_fieldQuickOptions_Duplicate_process = function (el_parent, type) {
				var tmp_vars = rocketform.getInnerVariable('fields_duplication_stored');

				var sel_element = $('.uiform-enable-fieldset')
					.find('a[data-type="' + type + '"]')
					.first();
				var el = $(sel_element).clone();
				el.insertAfter(el_parent);

				var f_step = $('.uiform-step-content .uiform-step-pane:visible').data('uifm-step');

				var new_parent_id = rocketform.getFieldsAfterDraggable(el, type, true, el_parent.attr('id'));

				rocketform.enableFieldPlugin(f_step, new_parent_id, type, rocketform.getUiData3('steps_src', f_step, new_parent_id));

				var tmp_f_id, tmp_f_type, tmp_sel_el, tmp_new_el, tmp_new_parent, tmp_new_parent_f, tmp_new_id, len_children;

				var uifm_afterdrag_timer;

				switch (parseInt(type)) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						uifm_afterdrag_timer = setInterval(function () {
							if ($('#' + new_parent_id).find('.sfdc-container-fluid').length) {
								if (parseInt(tmp_vars['inner'].length) != 0) {
									$.each(tmp_vars['inner'], function (index2, value2) {
										tmp_new_parent = $('#' + new_parent_id).find('> .sfdc-container-fluid .zgpb-fl-gs-block-style:eq(' + index2 + ')');
										tmp_new_parent_f = tmp_new_parent.find('> .zgpb-fl-gs-block-inner');

										len_children = $.map(value2['children'], function (n, i) {
											return i;
										}).length;

										if (parseInt(len_children) > 0) {
											$.each(value2['children'], function (index3, value3) {
												tmp_f_id = value3['id'];
												tmp_f_type = value3['type'];

												rocketform.fieldQuickOptions_Duplicate_checkChildren(tmp_f_type, tmp_f_id, tmp_new_parent_f);
											});
										}
									});
								}

								clearInterval(uifm_afterdrag_timer);
								uifm_afterdrag_timer = null;
							}
						}, 1000);

						break;
					case 31:
						uifm_afterdrag_timer = setInterval(function () {
							if ($('#' + new_parent_id).find('> .uiform-field-wrap').length) {
								if (parseInt(tmp_vars['inner'].length) != 0) {
									$.each(tmp_vars['inner'], function (index2, value2) {
										tmp_new_parent = $('#' + new_parent_id)
											.find('> .uiform-field-wrap')
											.find('.uifm-input31-main-wrap')
											.first();
										tmp_new_parent_f = tmp_new_parent.find('> .uiform-grid-inner-col');

										len_children = $.map(value2['children'], function (n, i) {
											return i;
										}).length;

										if (parseInt(len_children) > 0) {
											$.each(value2['children'], function (index3, value3) {
												tmp_f_id = value3['id'];
												tmp_f_type = value3['type'];

												rocketform.fieldQuickOptions_Duplicate_checkChildren(tmp_f_type, tmp_f_id, tmp_new_parent_f);
											});
										}
									});
								}

								clearInterval(uifm_afterdrag_timer);
								uifm_afterdrag_timer = null;
							}
						}, 1000);

						break;
				}
			};

			arguments.callee.fieldQuickOptions_Duplicate_checkChildren = function (tmp_f_type, tmp_f_id, tmp_new_parent_f) {
				var tmp_new_id, tmp_sel_el, tmp_new_el, tmp_vars, tmp_new_parent, tmp_new_parent_f2, len_children, tmp_f_id2, tmp_f_type2;

				tmp_vars = rocketform.getInnerVariable('fun_dupli_cur_field');

				tmp_sel_el = $('.uiform-enable-fieldset').find('a[data-type="' + tmp_f_type + '"]');

				tmp_new_el = $(tmp_sel_el).clone();

				tmp_new_parent_f.append(tmp_new_el);

				tmp_new_id = rocketform.getFieldsAfterDraggable(tmp_new_el, tmp_f_type, true, tmp_f_id);
				var f_step = $('.uiform-step-content .uiform-step-pane:visible').data('uifm-step');

				rocketform.enableFieldPlugin(f_step, tmp_new_id, tmp_f_type, rocketform.getUiData3('steps_src', f_step, tmp_new_id));

				var uifm_afterdrag_timer;
				switch (parseInt(tmp_f_type)) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:

						uifm_afterdrag_timer = setInterval(function () {
							if ($('#' + tmp_new_id).find('.sfdc-container-fluid').length) {
								if (tmp_vars.hasOwnProperty('inner') && parseInt(tmp_vars['inner'].length) != 0) {
									$.each(tmp_vars['inner'], function (index2, value2) {
										tmp_new_parent = $('#' + tmp_new_id).find('> .sfdc-container-fluid .zgpb-fl-gs-block-style:eq(' + index2 + ')');
										tmp_new_parent_f2 = tmp_new_parent.find('> .zgpb-fl-gs-block-inner');

										len_children = $.map(value2['children'], function (n, i) {
											return i;
										}).length;

										if (parseInt(len_children) > 0) {
											$.each(value2['children'], function (index3, value3) {
												tmp_f_id2 = value3['id'];
												tmp_f_type2 = value3['type'];

												rocketform.setInnerVariable('fun_dupli_cur_field', value3);

												rocketform.fieldQuickOptions_Duplicate_checkChildren(tmp_f_type2, tmp_f_id2, tmp_new_parent_f2);
											});
										}
									});
								}

								clearInterval(uifm_afterdrag_timer);
								uifm_afterdrag_timer = null;
							}
						}, 1000);
						break;
					default:
						break;
				}
			};

			arguments.callee.fields2_fieldQuickOptions_deleteField = function (id) {
				var box_title = $('#zgpb_fld_del_box_title').val(),
					box_msg = $('#zgpb_fld_del_box_msg').val(),
					btn1_title = $('#zgpb_fld_del_box_bt1_title').val(),
					btn2_title = $('#zgpb_fld_del_box_bt2_title').val();

				bootbox.dialog({
					message: box_msg,
					title: box_title,
					buttons: {
						fld_del_opt1: {
							label: btn1_title,
							className: 'sfdc-btn-default',
							callback: function () {
								$('body').removeClass('sfdc-modal-open');
							}
						},
						fld_del_opt2: {
							label: btn2_title,
							className: 'sfdc-btn-primary',
							callback: function () {
								rocketform.fields2_fieldsetting_deleteField(id);

								rocketform.formvariables_removeFromlist(id);

								rocketform.fieldsdata_email_genListToIntMem();

								zgfm_back_helper.tooltip_removeall();

								$('body').removeClass('sfdc-modal-open');
							}
						}
					}
				});
			};

			arguments.callee.fields2_fieldsetting_deleteField = function (idselected) {
				var fld_step = $('#' + idselected)
					.closest('.uiform-step-pane')
					.data('uifm-step');
				fld_step = parseInt(fld_step);

				rocketform.delUiData3('steps_src', fld_step, idselected);

				rocketform.closeSettingTab();

				var tmp_arr = mainrformb['steps_src'][fld_step];
				var tmp_len = tmp_arr.length,
					tmp_i;
				for (tmp_i = 0; tmp_i < tmp_len; tmp_i++) tmp_arr[tmp_i] && tmp_arr.push(tmp_arr[tmp_i]);
				if ($.isArray(tmp_arr)) {
					tmp_arr.splice(0, tmp_len);
					mainrformb['steps_src'][fld_step] = tmp_arr;
				}

				$('#' + idselected).remove();
			};

			arguments.callee.fieldQuickOptions_DuplicateField = function (element) {
			};

			arguments.callee.fieldQuickOptions_loadFieldSelected = function (pickfield) {
				if (pickfield && pickfield.attr('id')) {
					var idselected = $('#uifm-field-selected-id').val();

					if (idselected != pickfield.attr('id') || (!$('.uifm-tab-selectedfield').is(':visible') && idselected)) {
						rocketform.previewfield_hidePopOver();
						rocketform.previewfield_removeAllPopovers();
						rocketform.previewfield_removeAllUndesiredObj(pickfield);

						rocketform.previewfield_helpblock_hidetooltip();

						rocketform.enableSettingTabOnPick(pickfield.attr('id'), pickfield.data('typefield'));
						rocketform.setHighlightPicked(pickfield);
					}
					rocketform.enableSettingTabOption('uifm-label');
				}
			};
			arguments.callee.fieldQuickOptions_selectField_equalToOne = function () {
				rocketform.closeSettingTab();
				var obj_Checked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');
				var pickfield;
				$.each(obj_Checked, function (index, value) {
					pickfield = $(this).closest('.uiform-field');
					rocketform.fieldQuickOptions_loadFieldSelected(pickfield);
				});
			};

			arguments.callee.fieldQuickOptions_selectField_MoreThanOne = function () {
				try {
					var ObjChecked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');
					var ObjChecked_length = $('.uiform-main-form .uiform-fields-qopt-select input:checked').length;
					var arr = [];
					var id_field;
					var arr_f_input = [6, 7, 28, 29, 30];
					var arr_f_input_cont = 0;

					if ($(document).find('.uifm-highlight-edited')) {
						$(document).find('.uifm-highlight-edited').removeClass('uifm-highlight-edited');
					}

					$.each(ObjChecked, function (index, value) {
						var id_field = $(this).closest('.uiform-field').attr('data-typefield');
						if ($.inArray(parseInt(id_field), arr_f_input) < 0) {
						} else {
							arr_f_input_cont++;
						}
						arr.push(id_field);
						$(this).closest('.uiform-field').addClass('uifm-highlight-edited');
					});

					$('#uifm-field-selected-id').val('');
					var clvars;
					if (parseInt(ObjChecked_length) === arr_f_input_cont) {
						rocketform.cleanSettingTab();
						clvars = [
							'.uifm-tab-fld-label',
							'.uifm-tab-fld-input',
							'.uifm-tab-fld-helpblock',
							'.uifm-set-section-label',
							'.uifm-set-section-sublabel',
							'.uifm-set-section-blocktxt',
							'.uifm-set-section-input-valign',
							'.uifm-set-section-inputtextbox',
							'.uifm-set-section-inputboxbg',
							'.uifm-set-section-inputboxborder',
							'.uifm-set-section-helpblock'
						];
						$.each(clvars, function () {
							$(String(this)).removeClass('uifm-hide');
						});
					} else {
						rocketform.cleanSettingTab();
						clvars = ['.uifm-tab-fld-label', '.uifm-tab-fld-helpblock', '.uifm-set-section-label', '.uifm-set-section-sublabel', '.uifm-set-section-blocktxt', '.uifm-set-section-helpblock'];
						$.each(clvars, function () {
							$(String(this)).removeClass('uifm-hide');
						});
					}

					$('#uifm_fld_lbl_color').val('');
					$('#uifm_fld_lbl_sha_co').val('');
					$('#uifm_fld_sublbl_color').val('');
					$('#uifm_fld_sublbl_sha_co').val('');
				} catch (err) {
					console.log('error fieldQuickOptions_selectField_MoreThanOne: ' + err.message);
				}
			};

			arguments.callee.globalsettings_saveOptions = function () {
				rocketform.showLoader(3, true, true);
				var data = $('#uifrm-setting-form').serialize();
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/settings/ajax_save_options',
					data: data + '&action=rocket_fbuilder_setting_saveOpts&page=zgfm_form_builder' + '&zgfm_security=' + uiform_vars.ajax_nonce + '&csrf_field_name=' + uiform_vars.csrf_field_name,
					success: function (msg) {
						rocketform.hideLoader();
						rocketform.redirect_tourl(uiform_vars.url_admin + 'formbuilder/settings/view_settings');
					}
				});
			};

			arguments.callee.guidedtour_showTextOnPreviewPane_recalc = function () {
				if (parseInt($('.uiform-items-container').children().length) === 0) {
					var offsetLeft = $('.uiform-step-content').position().left - $('.uiform-step-content').closest('.uiform-preview-base').position().left;
					var offsetTop = parseFloat($('.uiform-step-content').position().top) + 25;
					$('.uiform-newform-help-highlight').css({
						top: offsetTop,
						left: offsetLeft
					});
				}
			};

			arguments.callee.guidedtour_showTextOnPreviewPane = function (show) {
				if (show) {
					if (parseInt($('.uiform-items-container').children().length) === 0) {
						$('.uiform-builder-preview').append($('.uiform-newform-help-highlight').parent().clone().html());
						rocketform.guidedtour_showTextOnPreviewPane_recalc();
					}
				} else {
					if ($('.uiform-builder-preview').find('.uiform-newform-help-highlight')) {
						$('.uiform-builder-preview').find('.uiform-newform-help-highlight').remove();
					}
				}
			};
			arguments.callee.images_getThumnail = function (html) {
				var theClass = $('img', html)
					.attr('class')
					.match(/wp-image-[\w-]*\b/);
				var tmp_class = theClass[0];
				tmp_class = tmp_class.split('-');
				var img_id = tmp_class[tmp_class.length - 1];
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_load_getthumbimg',
					data: {
						action: 'rocket_fbuilder_getthumbimg',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						html: encodeURIComponent(html),
						img_src_full: $('img', html).attr('src'),
						img_id: img_id,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {}
				});
			};

			arguments.callee.templates_load = function (number) {
				rocketform.showLoader(1, true, true);
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_load_templateform',
					data: {
						action: 'rocket_fbuilder_loadtemplate',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						number: number,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						rocketform.loadFormToEditPanel(msg);
						rocketform.loading_panelbox('rocketform-bk-dashboard', 0);

						rocketform.wizardform_refresh();

						rocketform.formvariables_genListToIntMem();
						rocketform.fieldsdata_email_genListToIntMem();


						rocketform.loading_panelbox2(0);
					}
				});
			};

			arguments.callee.wizardform_refresh = function () {
				var wiz_st = parseInt(rocketform.getUiData2('wizard', 'enable_st')) === 1 ? true : false;
				if (wiz_st) {
					$('.uiform-step-list').show();
					$('.uiform_frm_wiz_main_content').show();
					rocketform.wizardtab_refreshPreview();
					rocketform.wizardtab_changeThemeOnPreview();

					enableSortableItems();
					rocketform.wizardtab_gotoFirstPosition();
				} else {
					$('.uiform-step-list').hide();
					$('.uiform_frm_wiz_main_content').hide();
					rocketform.wizardtab_gotoFirstPosition();
				}
				var form_tab_skin = rocketform.getUiData('skin');

				var tab = $('#uiform-settings-tab3-2');
				var obj_field = $('.uiform-preview-base');
				$.each(form_tab_skin, function (i, value) {
					if ($.isPlainObject(value)) {
						$.each(value, function (i2, value2) {
							rocketform.setDataOptToSetFormTab(tab, 'skin', i + '-' + i2, value2);
							rocketform.setDataOptToPrevForm(obj_field, 'skin', i + '-' + i2, value2);
						});
					} else {
						rocketform.setDataOptToSetFormTab(tab, 'skin', i + '-' + '', value);
						rocketform.setDataOptToPrevForm(obj_field, 'skin', i + '-', value);
					}
				});
			};

			arguments.callee.guidedtour_load = function () {
				var obj = $('#uiform-container');
				var getpage = $('[data-uiform-page]').attr('data-uiform-page');
				var options;
				var intro;
				switch (String(getpage)) {
					case 'form_list':
						intro = introJs();
						intro.setOptions({
							steps: [
								{
									element: document.querySelector('#guidetour-flist-shortcode'),
									intro: document.querySelector('#guidetour-flist-shortcode').getAttribute('data-intro')
								},
								{
									element: document.querySelectorAll('.guidetour-flist-edit')[0],
									intro: document.querySelectorAll('.guidetour-flist-edit')[0].getAttribute('data-intro'),
									position: 'left'
								},
								{
									element: document.querySelectorAll('.guidetour-flist-del')[0],
									intro: document.querySelectorAll('.guidetour-flist-del')[0].getAttribute('data-intro'),
									position: 'left'
								}
							]
						});
						intro.start();
						break;
					case 'form_edit':
						intro = introJs();
						intro.setOptions({
							steps: [
								{
									element: document.querySelectorAll('.uiform-sidebar-fields')[0],
									intro: document.querySelectorAll('.uiform-sidebar-fields')[0].getAttribute('data-intro'),
									position: 'right'
								},
								{
									element: document.querySelectorAll('.uiform-preview-base')[0],
									intro: document.querySelectorAll('.uiform-preview-base')[0].getAttribute('data-intro'),
									position: 'right'
								},
								{
									element: document.querySelectorAll('.uiform-builder-maintab-container')[0],
									intro: document.querySelectorAll('.uiform-builder-maintab-container')[0].getAttribute('data-intro'),
									position: 'left'
								},
								{
									element: document.querySelectorAll('.uiform-settings-main')[0],
									intro: document.querySelectorAll('.uiform-settings-main')[0].getAttribute('data-intro'),
									position: 'left'
								},
								{
									element: document.querySelectorAll('.uiform-settings-skin')[0],
									intro: document.querySelectorAll('.uiform-settings-skin')[0].getAttribute('data-intro'),
									position: 'left'
								},
								{
									element: document.querySelectorAll('.uiform-settings-wizard')[0],
									intro: document.querySelectorAll('.uiform-settings-wizard')[0].getAttribute('data-intro'),
									position: 'left'
								},
								{
									element: document.querySelectorAll('.uiform-settings-email')[0],
									intro: document.querySelectorAll('.uiform-settings-email')[0].getAttribute('data-intro'),
									position: 'left'
								},
								{
									element: document.querySelectorAll('.uiform-settings-subm')[0],
									intro: document.querySelectorAll('.uiform-settings-subm')[0].getAttribute('data-intro'),
									position: 'left'
								}
							]
						});

						intro.onbeforechange(function (targetElement) {
							switch (this._currentStep) {
								case 0:

									break;
								case 1:
									break;
								case 2:

									break;
								case 3:

									break;

								default:
							}
						});

						intro.start();
						break;
					default:
						$('#uifm_modal_msg').sfdc_modal('show');
						$('#uifm_modal_msg .sfdc-modal-title').html($('#uifm_guidetour_popup_title').val());
						$('#uifm_modal_msg .sfdc-modal-body').html('<p>' + $('#uifm_guidetour_popup_notfound').val() + '</p>');
						break;
				}
			};

			arguments.callee.input4settings_generateField = function (obj, section) {
				var f_id = obj.attr('id');
				var f_step = $('#' + f_id)
					.closest('.uiform-step-pane')
					.data('uifm-step');

				var f_set_min = this.getUiData5('steps_src', f_step, f_id, section, 'set_min');
				var f_set_max = this.getUiData5('steps_src', f_step, f_id, section, 'set_max');
				var f_set_default = this.getUiData5('steps_src', f_step, f_id, section, 'set_default');
				var f_set_step = this.getUiData5('steps_src', f_step, f_id, section, 'set_step');

				var f_type = this.getUiData4('steps_src', f_step, f_id, 'type');

				var f_values = this.getUiData4('steps_src', f_step, f_id, section);

				var valhash = CryptoJS.MD5(JSON.stringify(f_values));

				var f_checkhash = $('#' + f_id)
					.find('.uifm-inp4-fld')
					.attr('data-check-hash');

				var f_src;
				var tmp_el_slider;
				switch (parseInt(f_type)) {
					case 16:
						f_src = $('#' + f_id).find('.uifm-inp4-fld');
						if (undefined == f_src.data('bootstrapSlider')) {
							if (
								parseInt(
									$('#' + f_id)
										.find('.slider')
										.find('.uifm-inp4-fld').length
								) != 0
							) {
								tmp_el_slider = f_src.detach();
								$('#' + f_id)
									.find('.uifm-input4-wrap')
									.append(tmp_el_slider);
								f_src = $('#' + f_id).find('.uifm-inp4-fld');
							}
							f_src.parent().find('.slider').remove();
							f_src.bootstrapSlider({
								step: parseFloat(f_set_step),
								min: parseFloat(f_set_min),
								max: parseFloat(f_set_max),
								value: parseFloat(f_set_default)
							});
						}
						break;
					case 17:
						f_src = $('#' + f_id).find('.uifm-inp4-fld');
						var f_set_range1 = this.getUiData5('steps_src', f_step, f_id, section, 'set_range1');
						var f_set_range2 = this.getUiData5('steps_src', f_step, f_id, section, 'set_range2');
						if (undefined == f_src.data('bootstrapSlider')) {
							if (
								parseInt(
									$('#' + f_id)
										.find('.slider')
										.find('.uifm-inp4-fld').length
								) != 0
							) {
								tmp_el_slider = f_src.detach();
								$('#' + f_id)
									.find('.uifm-input4-wrap')
									.append(tmp_el_slider);
								f_src = $('#' + f_id).find('.uifm-inp4-fld');
							}

							f_src.parent().find('.slider').remove();
							f_src.bootstrapSlider({
								step: parseFloat(f_set_step),
								min: parseFloat(f_set_min),
								max: parseFloat(f_set_max),
								range: true,
								value: [parseFloat(f_set_range1), parseFloat(f_set_range2)]
							});
						}
						break;
				}

				if (String(f_checkhash) === String(valhash)) {
				} else {
					$('#' + f_id)
						.find('.uifm-inp4-fld')
						.attr('data-check-hash', valhash);

					switch (parseInt(f_type)) {
						case 16:

							f_src.bootstrapSlider('setAttribute', 'step', parseFloat(f_set_step));
							f_src.bootstrapSlider('setAttribute', 'min', parseFloat(f_set_min));
							f_src.bootstrapSlider('setAttribute', 'max', parseFloat(f_set_max));
							f_src.bootstrapSlider('setAttribute', 'value', parseFloat(f_set_default));

							f_src.bootstrapSlider('refresh');

							$('#' + f_id)
								.find('.uifm-inp4-number')
								.html(f_set_default);
							break;
						case 17:
							f_src.bootstrapSlider('setAttribute', 'step', parseFloat(f_set_step));
							f_src.bootstrapSlider('setAttribute', 'min', parseFloat(f_set_min));
							f_src.bootstrapSlider('setAttribute', 'max', parseFloat(f_set_max));
							f_src.bootstrapSlider('setAttribute', 'value', [parseFloat(f_set_range1), parseFloat(f_set_range2)]);
							f_src.bootstrapSlider('setAttribute', 'range', true);

							f_src.bootstrapSlider('refresh');

							break;
						case 18:
							f_src = $('#' + f_id).find('.uifm-input4-wrap');
							f_src.find('.uifm-inp4-fld').val(parseFloat(f_set_default));
							if (parseInt(f_src.find('.bootstrap-touchspin').length) != 0) {
								f_src.find('.uifm-inp4-fld').trigger('touchspin.updatesettings', {
									min: parseFloat(f_set_min),
									max: parseFloat(f_set_max),
									stepinterval: parseFloat(f_set_step),
									initval: parseFloat(f_set_default)
								});
							} else {
								f_src.find('.uifm-inp4-fld').TouchSpin({
									verticalbuttons: true,
									min: parseFloat(f_set_min),
									max: parseFloat(f_set_max),
									stepinterval: parseFloat(f_set_step),
									verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
									verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus',
									initval: parseFloat(f_set_default)
								});
							}
							var f_skin_maxwidth_st = this.getUiData5('steps_src', f_step, f_id, section, 'skin_maxwidth_st');
							var f_skin_maxwidth = this.getUiData5('steps_src', f_step, f_id, section, 'skin_maxwidth');

							if (parseInt(f_skin_maxwidth_st) === 1) {
								f_src.css('max-width', f_skin_maxwidth + 'px');
								f_src.css('width', '100%');
							} else {
								f_src.removeCss('max-width');
							}

							break;
					}
				}
			};
			arguments.callee.backup_deleteStoredFile = function (el) {
				var delfile = el.attr('data-uifm-file');
				rocketform.loading_panelbox2(1);
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/settings/ajax_backup_deletefile',
					data: {
						action: 'uiform_fbuilder_setting_delbackupfile',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						uifm_frm_delfile: delfile,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function () {
						rocketform.loading_panelbox2(0);
						var re_url = uiform_vars.url_admin + 'formbuilder/settings/backup_settings';
						rocketform.redirect_tourl(re_url);
					}
				});
			};
			arguments.callee.backup_restoreBackup = function (el) {
				var resfile = el.attr('data-uifm-file');
				rocketform.loading_panelbox2(1);
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/settings/ajax_backup_restorefile',
					data: {
						action: 'uiform_fbuilder_setting_restorebkpfile',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						uifm_frm_resfile: resfile,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function () {
						rocketform.loading_panelbox2(0);
						var msg = $('#uifm_bkp_msg_success_restore').val();
						$('#uifm-backup-response').html(rocketform.alerts_global_msg(1, msg));
					}
				});
			};
			arguments.callee.backup_PopUpRestore = function (el) {
				var box_title = $('#uifm_bkp_restore_box_title').val(),
					box_msg = $('#uifm_fld_del_box_msg').val(),
					btn1_title = $('#uifm_fld_del_box_bt1_title').val(),
					btn2_title = $('#uifm_fld_del_box_bt2_title').val();

				bootbox.dialog({
					message: box_msg,
					title: box_title,
					buttons: {
						fld_del_opt1: {
							label: btn1_title,
							className: 'sfdc-btn-default',
							callback: function () {
								$('body').removeClass('sfdc-modal-open');
							}
						},
						fld_del_opt2: {
							label: btn2_title,
							className: 'sfdc-btn-primary',
							callback: function () {
								rocketform.backup_restoreBackup($(el));
								$('body').removeClass('sfdc-modal-open');
							}
						}
					}
				});
			};
			arguments.callee.showFeatureLocked = function (el) {

				$('#uifm_modal_msg').sfdc_modal('show');
				$('#uifm_modal_msg .sfdc-modal-title').html('Feature locked');
				var str_output = '';
				var obj = $(el);

				str_output = obj.attr('data-blocked-feature');

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/settings/ajax_blocked_getmessage',
					data: {
						action: 'uiform_fbuilder_blocked_getmessage',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						message: str_output,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (data) {
						$('#uifm_modal_msg .sfdc-modal-body').html(data.msg);
					}
				});
			};
			arguments.callee.backup_PopUpDelete = function (el) {
				var box_title = $('#uifm_bkp_del_box_title').val(),
					box_msg = $('#uifm_fld_del_box_msg').val(),
					btn1_title = $('#uifm_fld_del_box_bt1_title').val(),
					btn2_title = $('#uifm_fld_del_box_bt2_title').val();

				bootbox.dialog({
					message: box_msg,
					title: box_title,
					buttons: {
						fld_del_opt1: {
							label: btn1_title,
							className: 'sfdc-btn-default',
							callback: function () {
								$('body').removeClass('sfdc-modal-open');
							}
						},
						fld_del_opt2: {
							label: btn2_title,
							className: 'sfdc-btn-primary',
							callback: function () {
								rocketform.backup_deleteStoredFile($(el));
								$('body').removeClass('sfdc-modal-open');
							}
						}
					}
				});
			};
			arguments.callee.backup_create = function () {
				rocketform.loading_panelbox2(1);
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/settings/ajax_backup_create',
					data: {
						action: 'uiform_fbuilder_setting_backup',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						uifm_frm_namebackup: $('#_uifm_backup_namebkp').val(),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function () {
						rocketform.loading_panelbox2(0);
						$('#_uifm_backup_namebkp').val('');
						var re_url = uiform_vars.url_admin + 'formbuilder/settings/backup_settings';
						rocketform.redirect_tourl(re_url);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {}
				});
			};
			arguments.callee.migrateToVersion3 = function () {
				rocketform.loading_panelbox2(1);
				$.each(mainrformb['steps_src'], function (i, value) {
					if ($.isPlainObject(value)) {
						$.each(value, function (i2, value2) {
							switch (parseInt(mainrformb['steps_src'][i][i2]['type'])) {
								case 1:
								case 2:
								case 3:
								case 4:
								case 5:
									delete mainrformb['steps_src'][i][i2]['skin'];
									break;
								default:
									delete mainrformb['steps_src'][i][i2]['skin'];
							}
						});
					} else {
					}
				});

				this.migrateToVersion3_process();
			};

			arguments.callee.migrateToVersion3_process = function () {
				var tmp_frm = mainrformb;

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_refresh_previewpanel',
					data: {
						action: 'rocket_fbuilder_refreshpreviewpanel',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						uifm_frm_main_title: $('#uifm_frm_main_title').val(),
						uifm_frm_main_id: $('#uifm_frm_main_id').val(),
						form_data: encodeURIComponent(JSON.stringify(tmp_frm)),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						msg.data.fmb_html_backend = decodeURIComponent(msg.data.fmb_html_backend);
						var mainrformb_tmp = {
							main: msg.data.fmb_data['main'],
							skin: msg.data.fmb_data['skin'],
							wizard: msg.data.fmb_data['wizard'],
							onsubm: msg.data.fmb_data['onsubm'],
							num_tabs: msg.data.fmb_data['num_tabs'],
							steps: msg.data.fmb_data['steps'],
							steps_src: msg.data.fmb_data['steps_src']
						};
						mainrformb = $.extend(true, {}, mainrformb, mainrformb_tmp);

						$('.uiform-preview-base').html(msg.data.fmb_html_backend);


						var id, field_instance;
						var set_option;
						$.each(mainrformb['steps_src'], function (i, value) {
							if ($.isPlainObject(value)) {
								$.each(value, function (i2, value2) {
									switch (parseInt(mainrformb['steps_src'][i][i2]['type'])) {
										case 1:
										case 2:
										case 3:
										case 4:
										case 5:
											set_option = mainrformb['steps_src'][i][i2];
											id = mainrformb['steps_src'][i][i2]['id'];

											$('#' + id).zgpbld_gridsystem();

											field_instance = $('#' + id).data('zgpbld_gridsystem');

											field_instance.setToDatalvl1('id', id);

											switch (parseInt(mainrformb['steps_src'][i][i2]['type'])) {
												case 1:
													field_instance.setToDatalvl1('type', 1);
													field_instance.setToDatalvl1('type_n', 'grid1');
													break;
												case 2:
													field_instance.setToDatalvl1('type', 2);
													field_instance.setToDatalvl1('type_n', 'grid2');
													break;
												case 3:
													field_instance.setToDatalvl1('type', 3);
													field_instance.setToDatalvl1('type_n', 'grid3');
													break;
												case 4:
													field_instance.setToDatalvl1('type', 4);
													field_instance.setToDatalvl1('type_n', 'grid4');
													break;
												case 5:
													field_instance.setToDatalvl1('type', 5);
													field_instance.setToDatalvl1('type_n', 'grid6');
													break;
											}

											field_instance.createBlockAttributes();

											field_instance.update_settingsData(set_option);

											field_instance.setStep(i);

											field_instance.updateVarData(id);

											field_instance.setDataToCoreStore(i, id);

											break;
										default:
									}
								});
							} else {
							}
						});
						msg.data.fmb_data['steps_src'] = mainrformb['steps_src'];
						rocketform.loadFormToEditPanel(msg);

						rocketform.wizardform_refresh();

						rocketform.loading_panelbox2(0);
					}
				});
			};

			arguments.callee.refreshPreviewSection_process = function () {
				var tmp_frm = mainrformb;

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_refresh_previewpanel',
					data: {
						action: 'rocket_fbuilder_refreshpreviewpanel',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						uifm_frm_main_title: $('#uifm_frm_main_title').val(),
						uifm_frm_main_id: $('#uifm_frm_main_id').val(),
						form_data: encodeURIComponent(JSON.stringify(tmp_frm)),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						msg.data.fmb_html_backend = decodeURIComponent(msg.data.fmb_html_backend);

						rocketform.loadFormToEditPanel(msg);

						rocketform.wizardform_refresh();

						rocketform.loading_panelbox2(0);

						if (
							parseInt(
								$.map(mainrformb['steps_src'], function (n, i) {
									return i;
								}).length
							) != 0
						) {
							$.each(mainrformb['steps_src'], function (index3, value3) {
								$.each(value3, function (index4, value4) {
									switch (parseInt(value4['type'])) {
										case 1:
										case 2:
										case 3:
										case 4:
										case 5:
											break;
										case 8:
										case 9:
										case 10:
										case 11:
											var tmp_opt = rocketform.getUiData5('steps_src', parseInt(index3), value4['id'], 'input2', 'options');

											rocketform.setUiData5('steps_src', parseInt(index3), value4['id'], 'input2', 'options', {});

											for (var key in tmp_opt) {
												rocketform.addIndexUiData5('steps_src', parseInt(index3), value4['id'], 'input2', 'options', String(key));
												rocketform.setUiData6('steps_src', parseInt(index3), value4['id'], 'input2', 'options', String(key), {
													value: tmp_opt[key]['value'],
													label: tmp_opt[key]['label'],
													checked: tmp_opt[key]['checked'],
													order: tmp_opt[key]['order'],
													id: tmp_opt[key]['id']
												});
											}

											break;
										default:
											break;
									}
								});
							});
						}
					}
				});
			};

			arguments.callee.refreshPreviewSection = function () {
				rocketform.loading_panelbox2(1);
				rocketform.saveform_cleanForm();
				if ($(document).find('.uifm-highlight-edited')) {
					$(document).find('.uifm-highlight-edited').removeClass('uifm-highlight-edited');
				}
				$('.uiform-main-form .uiform-fields-qopt-select input:checked').prop('checked', false);
				$('.uiform-main-form .uiform-fields-qopt-select input:checked').closest('.uiform-fields-quick-options').removeCss('display');
				this.closeSettingTab();
				rocketform.showLoader(2, true, true);

				this.saveTabContent();

				if (parseInt($('.uiform-main-form').find('.uifm-input-ratingstar').length) != 0) {
					var rockfm_tmp_rs = $('.uiform-main-form').find('.uifm-input-ratingstar');
					rockfm_tmp_rs.each(function (i) {
						$(this).rating('destroy');
					});
				}

				if (parseInt($('.uiform-main-form').find('.uifm-input-ratingstar').length) != 0) {
					$('.uiform-main-form')
						.find('.uifm-input-ratingstar')
						.each(function (i) {
							rocketform.input9settings_updateField($(this).closest('.uiform-field'), 'input9');
						});
				}

				this.refreshPreviewSection_process();

				$('.sfdc-tooltip').hide();
			};

			arguments.callee.refreshPreviewSectionFromData = function () {
				rocketform.loading_panelbox2(1);
				if ($(document).find('.uifm-highlight-edited')) {
					$(document).find('.uifm-highlight-edited').removeClass('uifm-highlight-edited');
				}
				$('.uiform-main-form .uiform-fields-qopt-select input:checked').prop('checked', false);
				$('.uiform-main-form .uiform-fields-qopt-select input:checked').closest('.uiform-fields-quick-options').removeCss('display');
				this.closeSettingTab();
				rocketform.showLoader(2, true, true);

				var tab_content = {},
					tab_titles = {},
					tabcontent_tmp,
					tabtitle_tmp;
				var var_steps_src = this.getUiData('steps_src');

				$.each(var_steps_src, function (i, value) {
					tabcontent_tmp = {};
					tabcontent_tmp.content = rocketform.getLayoutFormByStep(i);
					tab_content[i] = tabcontent_tmp;
				});

				this.setUiData2('steps', 'tab_cont', tab_content);


				if (parseInt($('.uiform-main-form').find('.uifm-input-ratingstar').length) != 0) {
					var rockfm_tmp_rs = $('.uiform-main-form').find('.uifm-input-ratingstar');
					rockfm_tmp_rs.each(function (i) {
						$(this).rating('destroy');
					});
				}

				if (parseInt($('.uiform-main-form').find('.uifm-input-ratingstar').length) != 0) {
					$('.uiform-main-form')
						.find('.uifm-input-ratingstar')
						.each(function (i) {
							rocketform.input9settings_updateField($(this).closest('.uiform-field'), 'input9');
						});
				}

				this.refreshPreviewSection_process();

				$('.sfdc-tooltip').hide();
			};

			arguments.callee.form_getcode = function (form_id) {
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/getcode',
					data: {
						action: 'rocket_fbuilder_modal_form_getshorcodes',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						form_id: form_id,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					beforeSend: function () {
						$('#uifm_modal_msg .sfdc-modal-body').html(' <i class="sfdc-glyphicon sfdc-glyphicon-refresh gly-spin"></i>');
					},
					success: function (response) {
						var arrJson = (JSON && JSON.parse(response)) || $.parseJSON(response);
						$('#uifm_modal_msg').sfdc_modal('show');
						$('#uifm_modal_msg .sfdc-modal-title').html(arrJson.html_title);
						$('#uifm_modal_msg .sfdc-modal-body').html(arrJson.html);
					}
				});
			};
			arguments.callee.modal_close = function () {
				$('#modaltemplate').sfdc_modal('hide');
			};

			arguments.callee.formvariables_genListToIntMem = function () {
				rocketform.formvariables_generateTable();
				return;

				if (!rocketform.getInnerVariable('form_rec_vars')) {
					rocketform.setInnerVariable('form_rec_vars', []);
				}


				if (
					parseInt(
						$.map(mainrformb['steps_src'], function (n, i) {
							return i;
						}).length
					) != 0
				) {
					$.each(mainrformb['steps_src'], function (index3, value3) {
						$.each(value3, function (index4, value4) {
							if (parseInt($('#' + index4).length) != 0) {
								switch (parseInt(value4['type'])) {
									case 6:
									case 7:
									case 8:
									case 9:
									case 10:
									case 11:
									case 12:
									case 13:
									case 15:
									case 16:
									case 17:
									case 18:
									case 21:
									case 22:
									case 23:
									case 24:
									case 25:
									case 26:
									case 28:
									case 29:
									case 30:
									case 40:
									case 41:
									case 42:
									case 43:
										rocketform.formvariables_addTolist(value4['id']);
										break;
								}
							}
						});
					});
				}
			};
			arguments.callee.formvariables_addTolist = function (value) {
				var temp;
				temp = this.getInnerVariable('form_rec_vars');
				if ($.inArray(value, temp) == -1) temp.push(value);
				this.setInnerVariable('form_rec_vars', temp);
				rocketform.formvariables_generateTable();
			};
			arguments.callee.formvariables_removeFromlist = function (id) {
				var temp;
				temp = this.getInnerVariable('form_rec_vars');
				var removeItem = id;
				temp = $.grep(temp, function (value) {
					return value != removeItem;
				});
				this.setInnerVariable('form_rec_vars', temp);
				rocketform.formvariables_generateTable();
			};
			arguments.callee.formvariables_generateTable = function () {
				var id = $('#uifm_frm_main_id').val();

				var tmp_frm = mainrformb;

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_variables_emailpage',
					data: {
						action: 'rocket_fbuilder_variables_emailpage',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						form_id: id,
						form_data: encodeURIComponent(JSON.stringify(tmp_frm)),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						$('#uiform-form-mailset-vars-tab-1 .uifm-tab-inner-vars-1').html(msg.message);
					}
				});
			};

			arguments.callee.formvariables_findFieldName = function (id) {
				var tmpval = '';
				dance: for (var i in mainrformb['steps_src']) {
					for (var j in mainrformb['steps_src'][i]) {
						if (String(mainrformb['steps_src'][i][j].id) === String(id)) {
							tmpval = mainrformb['steps_src'][i][j].field_name;
							break dance;
						}
					}
				}
				return tmpval;
			};

			arguments.callee.formvariables_findFieldType = function (id) {
				var tmpval = '';
				dance: for (var i in mainrformb['steps_src']) {
					for (var j in mainrformb['steps_src'][i]) {
						if (String(mainrformb['steps_src'][i][j].id) === String(id)) {
							tmpval = mainrformb['steps_src'][i][j].type;
							break dance;
						}
					}
				}
				return tmpval;
			};

			arguments.callee.fieldsdata_email_genListToIntMem = function () {
				rocketform.setInnerVariable('form_vars_fields_emailval', []);

				if (
					parseInt(
						$.map(mainrformb['steps_src'], function (n, i) {
							return i;
						}).length
					) != 0
				) {
					$.each(mainrformb['steps_src'], function (index3, value3) {
						$.each(value3, function (index4, value4) {
							if (parseInt($('#' + index4).length) != 0) {
								switch (parseInt(value4['type'])) {
									case 6:
									case 28:
									case 29:
									case 30:
										if (parseInt(value4['validate']['typ_val']) === 4) {
											rocketform.fieldsdata_email_addTolist(value4['id']);
										}
										break;
								}
							}
						});
					});
				}
				rocketform.customeremail_generateHtml();


				rocketform.adminemail_generateHtml();
			};
			arguments.callee.fieldsdata_email_addTolist = function (value) {

				var temp;
				temp = this.getInnerVariable('form_vars_fields_emailval');
				if ($.inArray(value, temp) == -1) temp.push(value);
				this.setInnerVariable('form_vars_fields_emailval', temp);
			};
			arguments.callee.customeremail_generateHtml = function () {
				$('#uifm_frm_email_usr_recipient').html('');
				$('#uifm_frm_email_usr_recipient').append('<option value="">' + $('#uifm_frm_email_usr_recipient').attr('data-uifm-firstoption') + '</option>');

				var temp = this.getInnerVariable('form_vars_fields_emailval');

				$.each(temp, function (index, value) {
					$('#uifm_frm_email_usr_recipient').append('<option value="' + value + '">' + rocketform.formvariables_findFieldName(value) + '</option>');
				});

				var customermail = rocketform.getUiData2('onsubm', 'mail_usr_recipient');

				if (parseInt($("#uifm_frm_email_usr_recipient option[value='" + customermail + "']").length) > 0) {
					$('#uifm_frm_email_usr_recipient').val(customermail);
				} else {
					$('#uifm_frm_email_usr_recipient').val('');
					rocketform.setUiData2('onsubm', 'mail_usr_recipient', '');
				}
			};

			arguments.callee.adminemail_generateHtml = function () {
				$('#uifm_frm_email_replyto').html('');
				$('#uifm_frm_email_replyto').append('<option value="">' + $('#uifm_frm_email_replyto').attr('data-uifm-firstoption') + '</option>');

				var temp = this.getInnerVariable('form_vars_fields_emailval');

				$.each(temp, function (index, value) {
					$('#uifm_frm_email_replyto').append('<option value="' + value + '">' + rocketform.formvariables_findFieldName(value) + '</option>');
				});

				var customermail = rocketform.getUiData2('onsubm', 'mail_replyto');

				if (parseInt($("#uifm_frm_email_replyto option[value='" + customermail + "']").length) > 0) {
					$('#uifm_frm_email_replyto').val(customermail);
				} else {
					$('#uifm_frm_email_replyto').val('');
					rocketform.setUiData2('onsubm', 'mail_replyto', '');
				}
			};

			arguments.callee.clogicgraph_popup = function () {
				$('#uiform-clogicgraph').dialog('open');

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_preview_clogic_graph',
					data: {
						action: 'rocket_fbuilder_preview_clogic_graph',
						page: 'zgfm_form_builder',
						csrf_field_name: uiform_vars.csrf_field_name,
						zgfm_security: uiform_vars.ajax_nonce,
						form_data: encodeURIComponent(JSON.stringify(mainrformb))
					},
					beforeSend: function () {
						$('#uiform-clogicgraph').html(' <i class="sfdc-glyphicon sfdc-glyphicon-refresh gly-spin"></i>');
					},
					success: function (response) {
						var arrJson = (JSON && JSON.parse(response)) || $.parseJSON(response);
						$('#uiform-clogicgraph').html(arrJson.html);
					}
				});
			};


			arguments.callee.loadFieldSettingTab = function (tmp_fld_load) {
				try {
					var block;

					var id = tmp_fld_load['id'];
					var type = tmp_fld_load['typefield'];
					var step_pane = tmp_fld_load['step_pane'];
					var addt = tmp_fld_load['addt'];
					var oncreation = tmp_fld_load['oncreation'] || false;

					var field_vars = [];
					field_vars['oncreation'] = oncreation;

					if (false) {
						rocketform.fields_showModalOptions();
					}

					rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 1);

					$('#uiform-build-field-tab').addClass('zgfm-fieldtab-flag-loading');

					switch (parseInt(type)) {
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:

							block = addt ? addt['block'] : 0;

							break;

						default:
							block = 0;
					}

					var tmp_fast_load = uiform_vars.fields_fastload;
					if (parseInt(tmp_fast_load) === 1) {
						var tmp_get_fieldOption;
						switch (parseInt(type)) {
							case 1:
							case 2:
							case 3:
							case 4:
							case 5:
							case 8:
							case 9:
							case 10:
							case 11:

								tmp_get_fieldOption = wp.template('zgfm-field-opt-type-' + type);
								break;

							default:
							case 6:
								tmp_get_fieldOption = wp.template('zgfm-field-opt-type-6');
						}

						let tmp_gfld = $('<div/>')
							.html(
								tmp_get_fieldOption({
									site_url: rockfm_vars.uifm_baseurl
								})
							)
							.text();

						let tmp_arr;
						if (parseInt(uiform_vars.app_is_lite) === 0) {
							tmp_arr = {
								modal_body: tmp_gfld,
								field_id: id,
								field_type: type,
								field_block: block,
								addons: ['func_anim']
							};
						} else {
							tmp_arr = {
								modal_body: tmp_gfld,
								field_id: id,
								field_type: type,
								field_block: block,
								addons: []
							};
						}

						zgfm_back_fld_options.load_on_selecteField(tmp_fld_load, tmp_arr);
					} else {
						$.ajax({
							type: 'POST',
							url: rockfm_vars.uifm_siteurl + 'formbuilder/fields/ajax_field_option',
							data: {
								action: 'rocket_fbuilder_field_options',
								page: 'zgfm_form_builder',
								csrf_field_name: uiform_vars.csrf_field_name,
								zgfm_security: uiform_vars.ajax_nonce,
								field_id: id,
								field_type: type,
								field_block: block
							},
							success: function (msg) {
								zgfm_back_fld_options.load_on_selecteField(tmp_fld_load, msg);
							}
						});
					}

				} catch (ex) {
					console.error(' error loadFieldSettingTab ', ex.message);
				}
			};


			arguments.callee.tinymceEvent_removeInst = function () {
				var editor;
				if ($('#uiform-build-field-tab').find('#uifm_fld_msc_text')) {
					if (typeof tinyMCE != 'undefined') {
						editor = tinyMCE.get('uifm_fld_msc_text');
						if (editor) {
							editor.remove();
						}
					}
				}

				if ($('#uiform-build-field-tab').find('#uifm_fld_price_lbl_format')) {
					if (typeof tinyMCE != 'undefined') {
						editor = tinyMCE.get('uifm_fld_price_lbl_format');
						if (editor) {
							editor.remove();
						}
					}
				}

				if ($('#uiform-build-field-tab').find('#uifm_fld_inp3_html')) {
					if (typeof tinyMCE != 'undefined') {
						editor = tinyMCE.get('uifm_fld_inp3_html');
						if (editor) {
							editor.remove();
						}
					}
				}

				if ($('#uiform-build-field-tab').find('#uifm_frm_inp18_txt_cont')) {
					if (typeof tinyMCE != 'undefined') {
						editor = tinyMCE.get('uifm_frm_inp18_txt_cont');
						if (editor) {
							editor.remove();
						}
					}
				}
			};


			arguments.callee.tinymceEvent_init = function () {
				return;
				var wpTxtContainer;
				if ($('#uiform-build-field-tab').find('#uifm_fld_msc_text')) {
					wpTxtContainer = 'uifm_fld_msc_text';

					(refEditor = tinyMCEPreInit.mceInit['zgpbrefeditor']), (editorProps = null);

					if (typeof tinymce != 'undefined') {
						editorProps = tinymce.extend({}, refEditor);
						editorProps.selector = '#' + wpTxtContainer;
						editorProps.body_class = editorProps.body_class.replace('zgpbrefeditor', wpTxtContainer);
						tinyMCEPreInit.mceInit[wpTxtContainer] = editorProps;
						tinymce.init(editorProps);
					}
					if (typeof quicktags != 'undefined') {
						quicktags({ id: wpTxtContainer });
						QTags._buttonsInit();
					}
					window.wpActiveEditor = wpTxtContainer;
				}

				if ($('#uiform-build-field-tab').find('#uifm_fld_inp3_html')) {
					wpTxtContainer = 'uifm_fld_inp3_html';

					(refEditor = tinyMCEPreInit.mceInit['zgpbrefeditor']), (editorProps = null);

					if (typeof tinymce != 'undefined') {
						editorProps = tinymce.extend({}, refEditor);
						editorProps.selector = '#' + wpTxtContainer;
						editorProps.body_class = editorProps.body_class.replace('zgpbrefeditor', wpTxtContainer);
						tinyMCEPreInit.mceInit[wpTxtContainer] = editorProps;
						tinymce.init(editorProps);
					}
					if (typeof quicktags != 'undefined') {
						quicktags({ id: wpTxtContainer });
						QTags._buttonsInit();
					}
					window.wpActiveEditor = wpTxtContainer;
				}

			};


			arguments.callee.checkIntegrityTinyMCE = function (type) {
				var status = false;
				try {
					var rich = typeof tinyMCE != 'undefined' && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden();
					if (rich) {
						status = true;
					}

					return status;
				} catch (err) {
					console.log('error handled - checkIntegrityTinyMCE : ' + err.message);
					return false;
				}
			};


			arguments.callee.fields_events_bswitch = function (tab) {
				try {
					$('.switch-field').bootstrapSwitchZgpb();
					$('.uifm-inp15-fld').bootstrapSwitchZgpb();

					$('#uiform-build-field-tab .switch-field').on('switchChange.bootstrapSwitchZgpb', function (event, state) {
						var f_id = $('#uifm-field-selected-id').val();
						var store = $(this).data('field-store');
						var f_store = store.split('-');
						var f_sec = f_store[0];
						var f_opt = f_store[1];
						var f_val = state ? 1 : 0;
						var f_step;
						var field_Checked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');
						if (parseInt(field_Checked.length) > 1) {
							obj_field = field_Checked.closest('.uiform-field');
							$.each(obj_field, function (index2, value2) {
								f_id = $(this).attr('id');
								f_step = $('#' + f_id)
									.closest('.uiform-step-pane')
									.data('uifm-step');
								rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
								if ($(this)) {
									rocketform.setDataOptToPrevField($(this), store, f_val);
								}
							});
						} else {
							f_step = $('#' + f_id)
								.closest('.uiform-step-pane')
								.data('uifm-step');

							rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
							var obj_field = $('#' + f_id);
							if (obj_field) {
								rocketform.setDataOptToPrevField(obj_field, store, f_val);
							}
						}
					});
				} catch (ex) {
					console.error(' error fields_events_bswitch ', ex.message);
				}
			};


			arguments.callee.fields_events_spinner = function (tab) {
				try {
					$('.uifm_fld_inp4_spinner').TouchSpin({
						verticalbuttons: true,
						min: -1000000000,
						max: 1000000000,
						decimals: 3,
						step: 0.001,
						verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
						verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
					});
					$('.uifm_fld_inp6_spinner').TouchSpin({
						verticalbuttons: true,
						min: 0,
						max: 5,
						stepinterval: 1,
						verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
						verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
					});
					$('.uifm_fld_inp2_stl1').TouchSpin({
						verticalbuttons: true,
						min: 0,
						max: 100,
						stepinterval: 1,
						verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
						verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
					});

					$('.uifm_fld_input16_spinner').TouchSpin({
						verticalbuttons: true,
						min: 0,
						max: 200,
						stepinterval: 1,
						verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
						verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
					});

					$('.uifm_fld_inp17_thopt_spinner').TouchSpin({
						verticalbuttons: true,
						min: 35,
						max: 1000,
						stepinterval: 1,
						verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
						verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
					});
					$('.uifm_fld_inp17_thopt_spinner_2').TouchSpin({
						verticalbuttons: true,
						min: 50,
						max: 1000,
						stepinterval: 1,
						verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
						verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
					});

					$('.uifm_fld_inp4_spinner,.uifm_fld_inp6_spinner,.uifm_fld_inp4_spinner,.uifm_fld_input16_spinner,.uifm_fld_inp2_stl1').on('change', function (e) {
						var f_id = $('#uifm-field-selected-id').val();
						var store = $(e.target).data('field-store');
						var f_store = store.split('-');
						var f_sec = f_store[0];
						var f_opt = f_store[1];
						var f_val = $(e.target).val();
						var f_step = $('#' + f_id)
							.closest('.uiform-step-pane')
							.data('uifm-step');
						rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
						var obj_field = $('#' + f_id);
						if (obj_field) {
							rocketform.setDataOptToPrevField(obj_field, store, f_val);
						}
					});
				} catch (ex) {
					console.error(' error fields_events_spinner ', ex.message);
				}
			};


			arguments.callee.fields_events_general = function (tab) {
				try {
					$('#uiform-build-field-tab .uifm_tinymce_obj').html('');

					tinymce.init({
						selector: '.uifm_tinymce_obj',
						theme: 'modern',
						menubar: false,
						height: 200,
						plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media contextmenu paste code'],
						relative_urls: false,
						remove_script_host: false,
						convert_urls: true,
						browser_spellcheck: true,
						verify_html: false,
						codemirror: {
							indentOnInit: true, 
							path: 'CodeMirror'
						},
						image_advtab: true,
						toolbar1: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect',
						toolbar2: '| image | media | link unlink anchor | forecolor backcolor | print preview code | youtube | qrcode | flickr | picasa ',
						file_browser_callback: elFinderBrowser,
						setup: function (ed) {
							ed.on('change KeyUp', function (e) {
								rocketform.captureEventTinyMCE(ed, e);
							});
						}
					});

					uiformRefreshFontMenu();

					jQuery('#uiform-build-field-tab select.sfm')
						.chosen()
						.change(function () {
							var font_sel = jQuery(this).data('stylesFontMenu').uifm_preview_font_change();
							var f_id = $('#uifm-field-selected-id').val();
							var store = $(this).data('field-store');
							var f_store = store.split('-');
							var f_sec = f_store[0];
							var f_opt = f_store[1];
							var f_val = JSON.stringify(font_sel);

							var f_step;
							var field_Checked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');
							if (parseInt(field_Checked.length) > 1) {
								if (f_val) {
									obj_field = field_Checked.closest('.uiform-field');
									$.each(obj_field, function (index2, value2) {
										f_id = $(this).attr('id');
										f_step = $('#' + f_id)
											.closest('.uiform-step-pane')
											.data('uifm-step');
										rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
										if ($(this)) {
											rocketform.setDataOptToPrevField($(this), store, f_val);
										}
									});
								}
							} else {
								f_step = $('#' + f_id)
									.closest('.uiform-step-pane')
									.data('uifm-step');
								rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
								var obj_field = $('#' + f_id);
								if (obj_field) {
									rocketform.setDataOptToPrevField(obj_field, store, font_sel.family);
								}
							}
						});

					$('#uiform-build-field-tab select.sfm').change(function () {});

					$('button[role="iconpicker"],div[role="iconpicker"]').iconpicker();

					$(document).on('change keyup focus keypress', '#uifm_fld_main_fldname', function (e) {
						var fldname = $('#uifm_fld_main_fldname').val();
						var pickfield = $('#uifm-field-selected-id').val();
						var f_step = $('#' + pickfield)
							.closest('.uiform-step-pane')
							.data('uifm-step');
						rocketform.fieldsetting_updateName(f_step, pickfield, fldname);
					});

					$('#uifm_fld_main_fldname').blur(function () {
						rocketform.formvariables_generateTable();
						rocketform.customeremail_generateHtml();

						let tmp_addon_arr = uiform_vars.addon;

						var tmp_function;
						var tmp_controller;

						for (var property1 in tmp_addon_arr) {
							if ('fieldName_onBlur' === String(property1)) {
								for (var property2 in tmp_addon_arr[property1]) {
									for (var property3 in tmp_addon_arr[property1][property2]) {
										tmp_controller = tmp_addon_arr[property1][property2][property3]['controller'];
										tmp_function = tmp_addon_arr[property1][property2][property3]['function'];
										window[tmp_controller][tmp_function]();
									}
								}
							}
						}
					});

					$(".uifm-fld-val-opts .sfdc-btn-group > .sfdc-btn[data-settings-option='group-checkboxes']").click(function () {
						var element = $(this);
						var parent_val = element.parent().parent();
						var valbox;

						var f_id = $('#uifm-field-selected-id').val();
						var store = $(this).data('field-store');
						var f_store = store.split('-');
						var f_sec = f_store[0];
						var f_opt = f_store[1];
						var f_val;
						var f_step = $('#' + f_id)
							.closest('.uiform-step-pane')
							.data('uifm-step');

						if (!element.hasClass('sfdc-active')) {
							$('.uifm-custom-validator').hide();
							parent_val.find('.uifm-f-setoption-gchecks').not(element).removeClass('sfdc-active');


							element.addClass('sfdc-active');

							valbox = element.data('field-select-box');
							$('.' + valbox).show();

							f_val = parseInt($(this).data('field-value'));
						} else {
							element.removeClass('sfdc-active');

							valbox = element.data('field-select-box');
							$('.' + valbox).hide();
							f_val = 0;
						}

						rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
						var obj_field = $('#' + f_id);
						if (obj_field) {
							rocketform.setDataOptToPrevField(obj_field, store, f_val);
						}
					});
					$(".sfdc-btn-group > .sfdc-btn[data-settings-option='group-radiobutton']").click(function (e) {
						var element = $(this),
							parent = element.parent();
						parent
							.children('.sfdc-btn[data-toggle-enable]')
							.removeClass(function () {
								return 'sfdc-active';
							})
							.addClass(function () {
								return '';
							})
							.children('input')
							.prop('checked', false);
						element.addClass('sfdc-active');

						element.children('input').prop('checked', true);
					});

					$(document).on('keyup focus', '#uifm_fld_msc_text,#uifm_fld_inp3_html,#uifm_fld_price_lbl_format,#uifm_frm_inp18_txt_cont', function (e) {
						rocketform.captureEventTinyMCE2(e);
					});

					$(document).on('click', '.uifm-f-setoption-btn', function (e) {
						if (e) {
							e.stopPropagation();
							e.preventDefault();
						}

						var f_id = $('#uifm-field-selected-id').val();
						var store = $(this).data('field-store');
						var f_store = store.split('-');
						var f_sec = f_store[0];
						var f_opt = f_store[1];
						var f_val = $(this).find('input').val();
						var f_step;
						var field_Checked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');

						if (parseInt(field_Checked.length) > 1) {
							obj_field = field_Checked.closest('.uiform-field');
							$.each(obj_field, function (index2, value2) {
								f_id = $(this).attr('id');
								f_step = $('#' + f_id)
									.closest('.uiform-step-pane')
									.data('uifm-step');
								rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
								if ($(this)) {
									rocketform.setDataOptToPrevField($(this), store, f_val);
								}
							});
						} else {
							f_step = $('#' + f_id)
								.closest('.uiform-step-pane')
								.data('uifm-step');

							rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
							var obj_field = $('#' + f_id);
							if (obj_field) {
								rocketform.setDataOptToPrevField(obj_field, store, f_val);
							}
						}
					});

					$(document).on('change', '#uiform-build-field-tab .uifm-f-setoption-st', function (e) {
						if (e) {
							e.stopPropagation();
							e.preventDefault();
						}
						var field_Checked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');
						var f_id = $('#uifm-field-selected-id').val();
						var store = $(this).data('field-store');
						var f_store = store.split('-');
						var f_sec = f_store[0];
						var f_opt = f_store[1];
						var f_val = $(this).is(':checked');
						f_val = f_val ? 1 : 0;
						var f_step;

						if (parseInt(field_Checked.length) > 1) {
							obj_field = field_Checked.closest('.uiform-field');

							$.each(obj_field, function (index2, value2) {
								f_id = $(this).attr('id');
								f_step = $('#' + f_id)
									.closest('.uiform-step-pane')
									.data('uifm-step');

								rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
								if ($(this)) {
									rocketform.setDataOptToPrevField($(this), store, f_val);
								}
							});
						} else {
							f_step = $('#' + f_id)
								.closest('.uiform-step-pane')
								.data('uifm-step');
							rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
							var obj_field = $('#' + f_id);
							if (obj_field) {
								rocketform.setDataOptToPrevField(obj_field, store, f_val);
							}
						}
					});

					$(document).on('change keyup', '.uifm-f-setoption', function (e) {
						if (e) {
							e.stopPropagation();
							e.preventDefault();
						}
						var f_id = $('#uifm-field-selected-id').val();
						var store = $(this).data('field-store');
						var f_store = store.split('-');
						var f_sec = f_store[0];
						var f_opt = f_store[1];
						var f_val = $(this).val();
						var f_step;
						var field_Checked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');
						if (parseInt(field_Checked.length) > 1) {
							obj_field = field_Checked.closest('.uiform-field');

							$.each(obj_field, function (index2, value2) {
								f_id = $(this).attr('id');
								f_step = $('#' + f_id)
									.closest('.uiform-step-pane')
									.data('uifm-step');
								rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
								if ($(this)) {
									rocketform.setDataOptToPrevField($(this), store, f_val);
								}
							});
						} else {
							f_step = $('#' + f_id)
								.closest('.uiform-step-pane')
								.data('uifm-step');
							rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
							var obj_field = $('#' + f_id);
							if (obj_field) {
								rocketform.setDataOptToPrevField(obj_field, store, f_val);
							}
						}
					});


					$('#uifm_fld_inp2_style_type').on('change', function (e) {
						var f_val = $(e.target).val();
						switch (parseInt(f_val)) {
							case 1:
								$('.uifm-set-section-input2-stl1').show();
								break;
							default:
								$('.uifm-set-section-input2-stl1').hide();
						}
					});

					$(document).on('change keyup', '.uifm-f-setoption-font', function (e) {
						if (e) {
							e.stopPropagation();
							e.preventDefault();
						}

						var f_id = $('#uifm-field-selected-id').val();
						var store = $(this).parent().find('select').data('field-store');
						var f_store = store.split('-');

						var f_sec = f_store[0];
						var f_opt = f_store[1];
						var f_val = $(this).val();

						var f_step;
						var field_Checked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');
						if (parseInt(field_Checked.length) > 1) {
							obj_field = field_Checked.closest('.uiform-field');

							$.each(obj_field, function (index2, value2) {
								f_id = $(this).attr('id');
								f_step = $('#' + f_id)
									.closest('.uiform-step-pane')
									.data('uifm-step');
								rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
								if ($(this)) {
									rocketform.setDataOptToPrevField($(this), store, f_val);
								}
							});
						} else {
							f_step = $('#' + f_id)
								.closest('.uiform-step-pane')
								.data('uifm-step');
							rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
							var obj_field = $('#' + f_id);
							if (obj_field) {
								rocketform.setDataOptToPrevField(obj_field, store, f_val);
							}
						}
					});

					$('.sfdc-input-group-btn > .sfdc-btn').click(function () {
						var element = $(this),
							input = element.find('input');
						if (parseInt(input.val()) === 0) {
							element.addClass('sfdc-active');
							input.val(1);
						} else {
							element.removeClass('sfdc-active');
							input.val(0);
						}
					});

					$('#uifm_fld_elbg_type_1').on('click', function () {
						$('#uifm_fld_elbg_color_1').closest('.sfdc-row').show();
						$('#uifm_fld_elbg_color_2').closest('.sfdc-row').hide();
						$('#uifm_fld_elbg_color_3').closest('.sfdc-row').hide();
					});
					$('#uifm_fld_elbg_type_2').on('click', function () {
						$('#uifm_fld_elbg_color_1').closest('.sfdc-row').hide();
						$('#uifm_fld_elbg_color_2').closest('.sfdc-row').show();
						$('#uifm_fld_elbg_color_3').closest('.sfdc-row').show();
					});

					$('#uifm_fld_val_reqicon_img,#uifm_fld_inp2_stl1_icmark').on('change', function (e) {
						if (e) {
							e.stopPropagation();
							e.preventDefault();
						}
						var f_id = $('#uifm-field-selected-id').val();
						var store = $(this).data('field-store');
						var f_store = store.split('-');
						var f_sec = f_store[0];
						var f_opt = f_store[1];
						var f_val = e.icon;
						var f_step = $('#' + f_id)
							.closest('.uiform-step-pane')
							.data('uifm-step');
						rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
						var obj_field = $('#' + f_id);
						if (obj_field) {
							rocketform.setDataOptToPrevField(obj_field, store, f_val);
						}
					});


					$('#uifm_frm_clogic_st').on('switchChange.bootstrapSwitchZgpb', function (event, state) {
						var f_val = state ? 1 : 0;
						if (f_val === 1) {
							$('#uifm-show-conditional-logic').show();
						} else {
							$('#uifm-show-conditional-logic').hide();
						}
					});

					$('[data-toggle="tooltip"]').tooltip({ container: 'body' });

					var setfield_tab_active;

					$('.uiform-set-options-tabs ul.sfdc-nav-tabs').on('shown.bs.sfdc-tab', function (e) {
						setfield_tab_active = $(e.target).data('uifm-title');

						rocketform.setInnerVariable('setfield_tab_active', setfield_tab_active);
						rocketform.previewfield_hidePopOver();
					});
					$('.uiformc-menu-wrap ul.sfdc-nav-tabs a[data-toggle="sfdc-tab"],.uiform-set-options-tabs ul.sfdc-nav-tabs a[data-toggle="sfdc-tab"]').on('shown.bs.sfdc-tab', function (e) {

						if (!$(e.target).hasClass('uifm-tab-fld-validation')) {
							$('.sfdc-popover').popover('hide');
						}
					});

					$('.uiformc-menu-wrap ul.sfdc-nav-tabs a[data-toggle="sfdc-tab"],.uiform-set-options-tabs ul.sfdc-nav-tabs a[data-toggle="sfdc-tab"]').on('shown.bs.sfdc-tab', function (e) {
						setfield_tab_active = $(e.target).data('uifm-title');

						if (String(setfield_tab_active) === 'helpb') {
							rocketform.setInnerVariable('setfield_tab_active', setfield_tab_active);

							var id = $('#uifm-field-selected-id').val();
							rocketform.previewfield_elementTextarea($('#' + id), 'help_block');
						} else {
							zgfm_back_helper.tooltip_removeall();
						}
					});

					$('.uifm_field_font_selectpicker').selectpicker({
						style: 'btn-info',
						size: 4
					});
				} catch (ex) {
					console.error(' error fields_events_general ', ex.message);
				}
			};


			arguments.callee.fields2_events_cpicker = function (tab) {
				if (tab.find('.zgpb-custom-color').data('colorpicker')) {
				} else {
					tab.find('.zgpb-custom-color').colorpicker();

					tab
						.find('.zgpb-custom-color')
						.colorpicker()
						.on('changeColor', function (ev) {
							var f_store = $(this).data('field-store');
							var f_val = $(this).find('input').val();

							rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
						});
				}
			};


			arguments.callee.fields_events_cpicker = function (tab) {
				try {
					tab.find('.uifm-custom-color').colorpicker();

					$('#uiform-build-field-tab .uifm-custom-color')
						.colorpicker()
						.on('changeColor', function (ev) {
							var f_id = $('#uifm-field-selected-id').val();
							var store = $(this).data('field-store');
							var f_store = store.split('-');
							var f_sec = f_store[0];
							var f_opt = f_store[1];
							var f_val = $(this).find('input').val();
							var f_step;
							var obj_field;
							var field_Checked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');
							if (parseInt(field_Checked.length) > 1) {
								if (f_val) {
									obj_field = field_Checked.closest('.uiform-field');

									$.each(obj_field, function (index2, value2) {
										f_id = $(this).attr('id');
										f_step = $('#' + f_id)
											.closest('.uiform-step-pane')
											.data('uifm-step');
										rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
										if ($(this)) {
											rocketform.setDataOptToPrevField($(this), store, f_val);
										}
									});
								}
							} else {
								if (f_val) {
									f_step = $('#' + f_id)
										.closest('.uiform-step-pane')
										.data('uifm-step');
									rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
									obj_field = $('#' + f_id);
									if (obj_field) {
										rocketform.setDataOptToPrevField(obj_field, store, f_val);
									}
								}
							}
						});
				} catch (ex) {
					console.error(' error fields_events_cpicker ', ex.message);
				}
			};


			arguments.callee.fields_events_select = function (tab) {
				try {
					tab.find('.uifm_selectpicker').selectpicker({
						style: 'btn-info',
						size: 4
					});
					tab.find('.selectpicker').selectpicker();
				} catch (ex) {
					console.error(' error fields_events_cpicker ', ex.message);
				}
			};


			arguments.callee.fields_events_slider = function (tab) {
				try {
					tab.find('.uiform-opt-slider').bootstrapSlider();

					$('#uiform-build-field-tab .uiform-opt-slider').on('slide', function (slideEvt) {
						var f_id = $('#uifm-field-selected-id').val();
						var store = $(this).data('field-store');
						var f_store = store.split('-');
						var f_sec = f_store[0];
						var f_opt = f_store[1];
						var f_val = slideEvt.value;
						var f_step;
						var field_Checked = $('.uiform-main-form .uiform-fields-qopt-select input:checked');
						if (parseInt(field_Checked.length) > 1) {
							obj_field = field_Checked.closest('.uiform-field');
							$.each(obj_field, function (index2, value2) {
								f_id = $(this).attr('id');
								f_step = $('#' + f_id)
									.closest('.uiform-step-pane')
									.data('uifm-step');
								rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
								if ($(this)) {
									rocketform.setDataOptToPrevField($(this), store, f_val);
								}
							});
						} else {
							f_step = $('#' + f_id)
								.closest('.uiform-step-pane')
								.data('uifm-step');
							rocketform.setDataOptToCoreData(f_step, f_id, store, f_val);
							var obj_field = $('#' + f_id);
							if (obj_field) {
								rocketform.setDataOptToPrevField(obj_field, store, f_val);
							}
						}
					});
				} catch (ex) {
					console.error(' error fields_events_slider ', ex.message);
				}
			};


			arguments.callee.fields2_events_bswitch = function (tab) {
				if (tab.find('.zgpb-switch-field').data('bootstrap-switch')) {
				} else {
					tab.find('.zgpb-switch-field').bootstrapSwitchZgpb();

					tab.find('.zgpb-switch-field').on('switchChange.bootstrapSwitchZgpb', function (event, state) {
						var f_store = $(this).data('field-store');
						var f_val = state ? 1 : 0;

						rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
					});
				}
			};


			arguments.callee.fields2_events_groupbtn = function (tab) {
				if (tab.find('.sfdc-form-group').find('.zgpb-form-group-loaded').length) {
				} else {
					tab.find('.sfdc-form-group').addClass('zgpb-form-group-loaded');

					tab.find('.zgpb-col-setoption-btn').on('click', function (e) {
						if (e) {
							e.stopPropagation();
							e.preventDefault();
						}
						e.preventDefault();
						var element = $(this),
							parent = element.parent();

						parent
							.children('.sfdc-btn[data-toggle-enable]')
							.removeClass(function () {
								return $(this).data('toggle-enable');
							})
							.addClass(function () {
								return $(this).data('toggle-disable');
							})
							.children('input')
							.prop('checked', false);
						element.removeClass($(this).data('toggle-disable')).addClass(element.data('toggle-enable'));
						element.children('input').prop('checked', true);
					});

					tab.find('.zgpb-col-setoption-btn').on('click', function (e) {
						e.preventDefault();
						var f_store = $(this).data('field-store');
						var f_val = parseInt($(this).data('field-value'));
						rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
					});
				}
			};


			arguments.callee.fields2_events_general = function () {
				$(document).on('change keyup focus keypress', '#uifm_fld_main_fldname', function (e) {
					var fldname = $('#uifm_fld_main_fldname').val();
					var pickfield = $('#uifm-field-selected-id').val();
					var f_step = $('#' + pickfield)
						.closest('.uiform-step-pane')
						.data('uifm-step');
					rocketform.fieldsetting_updateName(f_step, pickfield, fldname);
				});

				$('#uifm-field-opt-content')
					.find('a[data-toggle="sfdc-tab"]')
					.on('shown.bs.sfdc-tab', function (e) {
					});

				$(document).on('change', '#uifm-field-opt-content .zgpb-f-setoption-st', function (e) {
					if (e) {
						e.stopPropagation();
						e.preventDefault();
					}

					var f_store = $(this).data('field-store');
					var f_val = $(this).is(':checked') ? 1 : 0;
					rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
				});

				$(document).on('change keyup', '#uifm-field-opt-content .zgpb-f-setoption', function (e) {
					if (e) {
						e.stopPropagation();
						e.preventDefault();
					}
					var f_store = $(this).data('field-store');
					var f_val = $(this).val();
					rocketform.updateModalFieldCoreAndPreview(f_store, f_val);
				});

				$(document).on('click', '#uifm-field-opt-content .zgpb-f-setoption-btn', function (e) {
					if (e) {
						e.stopPropagation();
						e.preventDefault();
					}
					var f_store = $(this).data('field-store');
					var f_val = $(this).find('input').val();
					rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
				});
			};


			arguments.callee.fields2_events_slider = function (tab) {
				tab.find('.zgpb-custom-slider').bootstrapSlider();

				tab.find('.zgpb-custom-slider').on('slide', function (slideEvt) {
					var f_store = $(this).data('field-store');
					var f_val = slideEvt.value;
					rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
				});
			};


			arguments.callee.fields2_events_txts = function (tab) {
				tab.find('.zgpb-field-col-event-txt').on('change keyup focus keypress', function (e) {
					if (e) {
						e.stopPropagation();
					}
					var f_store = $(this).data('field-store');
					var f_val = $(this).val();
					rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
				});
			};


			arguments.callee.fields2_events_spinner = function (tab) {
				if (tab.find('.zgpb_fld_settings_spinner').find('.bootstrap-touchspin-postfix').length) {
				} else {
					tab.find('.zgpb_fld_settings_spinner').TouchSpin({
						verticalbuttons: true,
						min: 0,
						max: 1500,
						stepinterval: 1,
						verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
						verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
					});

					tab.find('.zgpb_fld_settings_spinner').on('change', function (e) {
						if (e) {
							e.stopPropagation();
							e.preventDefault();
						}
						var f_store = $(e.target).data('field-store');
						var f_val = $(e.target).val();

						rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
					});
				}
			};


			arguments.callee.modal_editfield_col_bg_delimg = function () {
				$('#zgpb_fld_col_bg_srcimg_wrap').html('');
				$('#zgpb_fld_col_bg_imgsource').val('');
				var f_store = $('#zgpb_fld_col_bg_imgsourcebtnadd').data('field-store');
				var f_val = '';
				rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
			};


			arguments.callee.fields2_events_bgimages = function (tab) {
				tab.find('#zgpb_fld_col_bg_imgsourcebtnadd').on('click', function (e) {
					if (e) {
						e.stopPropagation();
						e.preventDefault();
					}

					var element = $(this);
					var formfield = 'zgpb_fld_col_bg_imgsource';
					rocketform.elfinder_showPopUp({
						windowURL: uiform_vars.url_elfinder2,
						windowName: '_blank',
						height: 490,
						width: 950,
						centerScreen: 1,
						location: 0
					});

					window.processFile = function (file) {
						var imgurl = file.url;
						$('#' + formfield).val(imgurl);
						$('#zgpb_fld_col_bg_srcimg_wrap').html('<img class="sfdc-img-thumbnail" src="' + imgurl + '" />');

						var f_store = element.data('field-store');
						var f_val = imgurl;
						rocketform.fields2_updateModalFieldCoreAndPreview(f_store, f_val);
					};
				});
			};

			arguments.callee.fields2_updateModalFieldCoreAndPreview = function (f_store, f_val) {
				try {
					var f_id;
					var f_type;
					f_id = $('#uifm-field-selected-id').val();
					f_type = $('#uifm-field-selected-type').val();

					var addt = [];
					switch (parseInt(f_type)) {
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
							var block = $('#zgpb-field-selected-block').val();
							addt['block'] = block;
							break;
						default:
							break;
					}

					rocketform.fields2_setDataOptToCoreData(f_id, f_type, f_store, f_val, addt);
					var obj_field = $('#' + f_id);
					if (obj_field) {
						rocketform.fields2_setDataOptToPrevField(obj_field, f_type, f_store, f_val, addt);
					}
				} catch (ex) {
					console.error('error fields2_updateModalFieldCoreAndPreview ', ex.message);
				}
			};

			arguments.callee.fields2_setDataOptToCoreData = function (id, f_type, f_store, value, addt) {
				try {
					var f_obj = $('#' + id);
					var tmp_vars;
					var tmp_vars_split;
					switch (parseInt(f_type)) {
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
							tmp_vars = [];
							tmp_vars_split = f_store.split('-');
							tmp_vars['id'] = id;
							tmp_vars['block'] = addt['block'];
							tmp_vars['opt1'] = tmp_vars_split[0];
							tmp_vars['opt2'] = tmp_vars_split[1];
							tmp_vars['opt3'] = tmp_vars_split[2];
							tmp_vars['opt4'] = value;

							f_obj.data('zgpbld_gridsystem').setDataToCore(tmp_vars);
							break;
						case 6:
						default:
							tmp_vars = [];
							tmp_vars_split = f_store.split('-');
							tmp_vars['id'] = id;
							tmp_vars['opt1'] = tmp_vars_split[0] || '';
							tmp_vars['opt2'] = tmp_vars_split[1] || '';
							tmp_vars['opt3'] = tmp_vars_split[2] || '';
							tmp_vars['opt4'] = value;
							switch (parseInt(f_type)) {
								case 6:
									$('#' + id)
										.data('uiform_textbox')
										.setDataToCore(tmp_vars);
									break;
								case 7:
									$('#' + id)
										.data('uiform_textarea')
										.setDataToCore(tmp_vars);
									break;
								case 8:
									$('#' + id)
										.data('uiform_radiobtn')
										.setDataToCore(tmp_vars);
									break;
								case 9:
									$('#' + id)
										.data('uiform_checkbox')
										.setDataToCore(tmp_vars);
									break;
								case 10:
									$('#' + id)
										.data('uiform_select')
										.setDataToCore(tmp_vars);
									break;
								case 11:
									$('#' + id)
										.data('uiform_multiselect')
										.setDataToCore(tmp_vars);
									break;
								case 12:
									$('#' + id)
										.data('uiform_fileupload')
										.setDataToCore(tmp_vars);
									break;
								case 13:
									$('#' + id)
										.data('uiform_imageupload')
										.setDataToCore(tmp_vars);
									break;
								case 14:
									$('#' + id)
										.data('uiform_customhtml')
										.setDataToCore(tmp_vars);
									break;
								case 15:
									$('#' + id)
										.data('uiform_password')
										.setDataToCore(tmp_vars);
									break;
								case 16:
									$('#' + id)
										.data('uiform_slider')
										.setDataToCore(tmp_vars);
									break;
								case 17:
									$('#' + id)
										.data('uiform_range')
										.setDataToCore(tmp_vars);
									break;
								case 18:
									$('#' + id)
										.data('uiform_spinner')
										.setDataToCore(tmp_vars);
									break;
								case 19:
									$('#' + id)
										.data('uiform_captcha')
										.setDataToCore(tmp_vars);
									break;
								case 20:
									$('#' + id)
										.data('uiform_submitbtn')
										.setDataToCore(tmp_vars);
									break;
								case 21:
									$('#' + id)
										.data('uiform_hiddeninput')
										.setDataToCore(tmp_vars);
									break;
								case 22:
									$('#' + id)
										.data('uiform_ratingstar')
										.setDataToCore(tmp_vars);
									break;
								case 23:
									$('#' + id)
										.data('uiform_colorpicker')
										.setDataToCore(tmp_vars);
									break;
								case 24:
									$('#' + id)
										.data('uiform_datepicker')
										.setDataToCore(tmp_vars);
									break;
								case 25:
									$('#' + id)
										.data('uiform_timepicker')
										.setDataToCore(tmp_vars);
									break;
								case 26:
									$('#' + id)
										.data('uiform_datetime')
										.setDataToCore(tmp_vars);
									break;
								case 27:
									$('#' + id)
										.data('uiform_recaptcha')
										.setDataToCore(tmp_vars);
									break;
								case 28:
									$('#' + id)
										.data('uiform_preptext')
										.setDataToCore(tmp_vars);
									break;
								case 29:
									$('#' + id)
										.data('uiform_appetext')
										.setDataToCore(tmp_vars);
									break;
								case 30:
									$('#' + id)
										.data('uiform_prepapptext')
										.setDataToCore(tmp_vars);
									break;
								case 31:
									$('#' + id)
										.data('uiform_panelfld')
										.setDataToCore(tmp_vars);
									break;
								case 32:
									$('#' + id)
										.data('uiform_divider')
										.setDataToCore(tmp_vars);
									break;
								case 33:
								case 34:
								case 35:
								case 36:
								case 37:
								case 38:
									$('#' + id)
										.data('uiform_heading')
										.setDataToCore(tmp_vars);
									break;
								case 39:
									$('#' + id)
										.data('uiform_wizardbtn')
										.setDataToCore(tmp_vars);
									break;
								case 40:
									$('#' + id)
										.data('uiform_switch')
										.setDataToCore(tmp_vars);
									break;
								case 41:
									$('#' + id)
										.data('uiform_dyncheckbox')
										.setDataToCore(tmp_vars);
									break;
								case 42:
									$('#' + id)
										.data('uiform_dynradiobtn')
										.setDataToCore(tmp_vars);
									break;
								case 43:
									$('#' + id)
										.data('uiform-datetime2')
										.setDataToCore(tmp_vars);
									break;
							}
					}
				} catch (ex) {
					console.error('error fields2_setDataOptToCoreData ', ex.message);
				}
			};

			arguments.callee.fields2_setDataOptToPrevField = function (f_obj, f_type, f_store, value, addt) {
				try {
					switch (parseInt(f_type)) {
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
							var tmp_vars = [];
							var tmp_vars_split = f_store.split('-');
							tmp_vars['block'] = addt['block'];
							tmp_vars['opt1'] = tmp_vars_split[0];
							tmp_vars['opt2'] = tmp_vars_split[1];
							tmp_vars['opt3'] = tmp_vars_split[2];
							tmp_vars['opt4'] = value;

							f_obj.data('zgpbld_gridsystem').setOptionsToPreview(tmp_vars);

							break;
						default:
							var tmp_vars = [];
							var tmp_vars_split = f_store.split('-');

							rocketform.setDataOptToPrevField(f_obj, f_store, value);
					}
				} catch (ex) {
					console.error('error fields2 setDataOptToPrevField ', ex.message);
				}
			};

			arguments.callee.rollback_openModal = function () {
				var id = $('#uifm_frm_main_id').val();

				try {
					rocketform.fields_showModalOptions();

					$.ajax({
						type: 'POST',
						url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_rollback_openmodal',
						data: {
							action: 'rocket_fbuilder_rollback_openmodal',
							page: 'zgfm_form_builder',
							zgfm_security: uiform_vars.ajax_nonce,
							form_id: id,
							csrf_field_name: uiform_vars.csrf_field_name
						},
						success: function (msg) {
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-header-inner').html(msg.modal_header);
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.sfdc-modal-body').html(msg.modal_body);
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-footer-wrap').html(msg.modal_footer);
						}
					});
				} catch (ex) {
					console.error('error rollback_openModal ', ex.message);
				}
			};

			arguments.callee.rollback_process = function (id) {
				try {
					rocketform.fields_showModalOptions();

					$.ajax({
						type: 'POST',
						url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_rollback_process',
						data: {
							action: 'rocket_fbuilder_rollback_process',
							page: 'zgfm_form_builder',
							zgfm_security: uiform_vars.ajax_nonce,
							log_id: id,
							csrf_field_name: uiform_vars.csrf_field_name
						},
						success: function (msg) {
							msg.data.fmb_html_backend = decodeURIComponent(msg.data.fmb_html_backend);

							rocketform.loadFormToEditPanel(msg);

							rocketform.wizardform_refresh();

							rocketform.loading_panelbox2(0);

							$('#zgpb-modal1').sfdc_modal('hide');
						}
					});
				} catch (ex) {
					console.error('error rollback_openModal ', ex.message);
				}
			};


			arguments.callee.fields_showModalOptions = function () {

				var $html_loading = '<img src="' + uiform_vars.url_assets + '/backend/image/ajax-loader-black.gif' + '"/>';
				$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-header-inner').html($html_loading);
				$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.sfdc-modal-body').html($html_loading);
				$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-footer-wrap').html($html_loading);

				$('#zgpb-modal1').find('.sfdc-modal-content').resizable({
				});
				$('#zgpb-modal1').find('.sfdc-modal-dialog').draggable();

				$('#zgpb-modal1').on('show.bs.modal', function () {
					$(this).find('.modal-body').css({
						'max-height': '100%'
					});
				});

				$('#zgpb-modal1').sfdc_modal({
					show: true,
					keyboard: true
				});
			};
			arguments.callee.modal_field_loader = function (status) {
				var mod_body = $('#zgpb-modal1').find('.sfdc-modal-dialog .sfdc-modal-body');
				if (parseInt(status) === 1) {
					if (parseInt(mod_body.find('#zgpb-modal-field-loader').length) === 0) {
						var tmp_tmpl = wp.template('zgpb-modal-field-loader');
						mod_body.append(tmp_tmpl());
					}
				} else {
					if (mod_body.find('#zgpb-modal-field-loader')) {
						mod_body.find('#zgpb-modal-field-loader').remove();
					}
				}
			};

			arguments.callee.check_fieldExist = function (name, index, key) {
				try {
					if (typeof mainrformb[name][index][key] != 'undefined') {
						return true;
					} else {
						return false;
					}
				} catch (err) {
					return false;
				}
			};
			arguments.callee.variables_openModal = function () {
				var id = $('#uifm_frm_main_id').val();

				rocketform.fields_showModalOptions();
				this.saveTabContent();

				var tmp_frm = mainrformb;

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_variables_openmodal',
					data: {
						action: 'rocket_fbuilder_variables_openmodal',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						form_id: id,
						form_data: encodeURIComponent(JSON.stringify(tmp_frm)),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-header-inner').html(msg.modal_header);
						$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.sfdc-modal-body').html(msg.modal_body);
						$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-footer-wrap').html(msg.modal_footer);
					}
				});
			};
			arguments.callee.get_coreData = function () {
				return mainrformb;
			};
		};
	})($uifm, window);
}
rocketform();

(function ($) {
	var zgpbld_gridsystem = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var field_onprocess = false;
		var elem = $(element);
		var cur_blockmain_st = true;
		var obj_main = this;
		var tmp_init_data = {
			skin: {
				align: {
					show_st: 0,
					max_width: '1200',
					max_width_st: '1'
				},
				margin: {
					show_st: 1,
					top: '0',
					bottom: '0',
					left: '0',
					right: '0'
				},
				padding: {
					show_st: 1,
					top: '5',
					bottom: '5',
					left: '0',
					right: '0'
				},
				text: {
					color: ''
				},
				background: {
					show_st: '0',
					type: '1',
					cl_start_color: '#eeeeee',
					cl_end_color: '#ffffff',
					cl_solid_color: '#eeeeee',
					img_source: '',
					img_repeat: '0',
					img_position: 'Center',
					img_attachment: 'Scroll',
					img_scale: 'Fill',
					img_overlay_color: '',
					img_overlay_opacity: '',
					img_size_type: '3',
					img_size_len: '100% 100%',
					opacity: '100'
				},
				border: {
					show_st: '0',
					color: '#000',
					color_focus_st: '0',
					color_focus: '#000',
					type: '1',
					width: '1'
				},
				border_radius: {
					show_st: '0',
					size: '17'
				},
				custom_css: {
					ctm_id: '',
					ctm_class: '',
					ctm_additional: ''
				},
				shadow: {
					show_st: '0',
					color: '#CCCCCC',
					h_shadow: '3',
					v_shadow: '3',
					blur: '10'
				}
			}
		};
		var defaults = {
			data: {
				type: 0,
				id: '',
				type_n: 'Grid',
				field_name: '',
				main: {},
				blocks: {}
			}
		};

		var settings = $.extend(true, {}, defaults);

		var cur_block_var;
		var zgpbvariable = [];
		zgpbvariable.innerVars = {};

		var setInnerVariable = function (name, value) {
			zgpbvariable.innerVars[name] = value;
		};

		var getInnerVariable = function (name) {
			if (zgpbvariable.innerVars[name]) {
				return zgpbvariable.innerVars[name];
			} else {
				return '';
			}
		};
		this.publicMethod = function () {};
		this.showSettingTab = function (id_element) {
		};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};

		this.setOptionsToModal = function (vars) {
			var tab = $('#uifm-field-opt-content');
			var opt1 = vars['opt1'],
				opt2 = vars['opt2'],
				opt3 = vars['opt3'],
				opt4 = vars['opt4'];
			switch (String(opt1)) {
				case 'skin':
					switch (String(opt2)) {
						case 'align':
							switch (String(opt3)) {
								case 'show_st':
									if (parseInt(opt4) === 1) {
										tab.find('#zgpb_fld_col_style_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#zgpb_fld_col_style_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'max_width_st':
									if (parseInt(opt4) === 1) {
										tab.find('#zgpb_fld_col_style_maxwidth_st').prop('checked', true);
									} else {
										tab.find('#zgpb_fld_col_style_maxwidth_st').prop('checked', false);
									}
									break;
								case 'max_width':
									tab.find('#zgpb_fld_col_style_maxwidth').val(opt4);
									break;
							}

							break;
						case 'margin':
							switch (String(opt3)) {
								case 'top':
									tab.find('#zgpb_fld_col_margin_top').val(opt4);
									break;
								case 'bottom':
									tab.find('#zgpb_fld_col_margin_bottom').val(opt4);
									break;
								case 'left':
									tab.find('#zgpb_fld_col_margin_left').val(opt4);
									break;
								case 'right':
									tab.find('#zgpb_fld_col_margin_right').val(opt4);
									break;
							}

							break;
						case 'padding':
							switch (String(opt3)) {
								case 'top':
									tab.find('#zgpb_fld_col_padding_top').val(opt4);
									break;
								case 'bottom':
									tab.find('#zgpb_fld_col_padding_bottom').val(opt4);
									break;
								case 'left':
									tab.find('#zgpb_fld_col_padding_left').val(opt4);
									break;
								case 'right':
									tab.find('#zgpb_fld_col_padding_right').val(opt4);
									break;
							}

							break;
						case 'text':
							switch (String(opt3)) {
								case 'color':
									tab.find('#zgpb_fld_col_text_color').parent().colorpicker('setValue', opt4);
									tab.find('#zgpb_fld_col_text_color').val(opt4);
									break;
							}
							break;
						case 'background':
							switch (String(opt3)) {
								case 'show_st':
									if (parseInt(opt4) === 1) {
										tab.find('#zgpb_fld_col_bg_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#zgpb_fld_col_bg_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'type':
									switch (parseInt(opt4)) {
										case 2:
											tab.find('#zgpb_fld_col_bg_type_2').addClass('sfdc-active');
											tab.find('#zgpb_fld_col_bg_type_1_cont').hide();
											tab.find('#zgpb_fld_col_bg_type_2_cont').show();

											break;
										case 1:
										default:
											tab.find('#zgpb_fld_col_bg_type_1').addClass('sfdc-active');
											tab.find('#zgpb_fld_col_bg_type_1_cont').show();
											tab.find('#zgpb_fld_col_bg_type_2_cont').hide();
											break;
									}
									break;
								case 'cl_start_color':
									tab.find('#zgpb_fld_col_bg_clstartcolor').parent().colorpicker('setValue', opt4);
									tab.find('#zgpb_fld_col_bg_clstartcolor').val(opt4);
									break;
								case 'cl_end_color':
									tab.find('#zgpb_fld_col_bg_clendcolor').parent().colorpicker('setValue', opt4);
									tab.find('#zgpb_fld_col_bg_clendcolor').val(opt4);
									break;
								case 'cl_solid_color':
									tab.find('#zgpb_fld_col_bg_clsolidcolor').parent().colorpicker('setValue', opt4);
									tab.find('#zgpb_fld_col_bg_clsolidcolor').val(opt4);
									break;
								case 'img_source':
									tab.find('#zgpb_fld_col_bg_imgsource').val(opt4);

									if (opt4) {
										tab.find('#zgpb_fld_col_bg_srcimg_wrap').html("<img class='sfdc-img-thumbnail' src='" + opt4 + "' />");
									}

									break;
								case 'img_size_type':
									tab.find('#zgpb_fld_col_bg_sizetype').val(opt4);
									if (parseInt(opt4) === 1 || parseInt(opt4) === 2) {
										$('#zgpb_fld_col_bg_sizetype_len_wrap').show();
									} else {
										$('#zgpb_fld_col_bg_sizetype_len_wrap').hide();
									}
									break;
								case 'img_size_len':
									tab.find('#zgpb_fld_col_bg_sizetype_len').val(opt4);
									break;
								case 'img_repeat':
									tab.find('#zgpb_fld_col_bg_repeat').val(opt4);
									break;
								case 'img_position':
									tab.find('#zgpb_fld_col_bg_pos').val(opt4);
									break;
							}
							break;
						case 'border':
							switch (String(opt3)) {
								case 'show_st':
									if (parseInt(opt4) === 1) {
										tab.find('#zgpb_fld_col_border_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#zgpb_fld_col_border_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'type':
									switch (parseInt(opt4)) {
										case 2:
											tab.find('#zgpb_fld_col_border_type_2').addClass('sfdc-active');
											break;
										case 1:
										default:
											tab.find('#zgpb_fld_col_border_type_1').addClass('sfdc-active');
											break;
									}
									break;
								case 'color':
									tab.find('#zgpb_fld_col_border_color').parent().colorpicker('setValue', opt4);
									tab.find('#zgpb_fld_col_border_color').val(opt4);
									break;
								case 'width':
									tab.find('#zgpb_fld_col_border_width').val(opt4);

									break;
							}
							break;
						case 'border_radius':
							switch (String(opt3)) {
								case 'show_st':
									if (parseInt(opt4) === 1) {
										tab.find('#zgpb_fld_col_bradius_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#zgpb_fld_col_bradius_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'size':
									tab.find('#zgpb_fld_col_bradius_size').val(opt4);

									break;
							}
							break;
						case 'shadow':
							switch (String(opt3)) {
								case 'show_st':
									if (parseInt(opt4) === 1) {
										tab.find('#zgpb_fld_col_shadow_st').bootstrapSwitchZgpb('state', true);
									} else {
										tab.find('#zgpb_fld_col_shadow_st').bootstrapSwitchZgpb('state', false);
									}
									break;
								case 'color':
									tab.find('#zgpb_fld_col_shadow_color').val(opt4);
									break;
								case 'h_shadow':
									tab.find('#zgpb_fld_col_shadow_h').bootstrapSlider('setValue', parseInt(opt4));
									break;
								case 'v_shadow':
									tab.find('#zgpb_fld_col_shadow_v').bootstrapSlider('setValue', parseInt(opt4));
									break;
								case 'blur':
									tab.find('#zgpb_fld_col_shadow_blur').bootstrapSlider('setValue', parseInt(opt4));
									break;
							}
							break;
						case 'custom_css':
							switch (String(opt3)) {
								case 'ctm_id':
									break;
								case 'ctm_class':
									tab.find('#zgpb_fld_col_ctmclass').val(opt4);
									break;
								case 'ctm_additional':
									tab.find('#zgpb_fld_ctmaddt').val(opt4);
									break;
							}
							break;
					}
					break;
			}
		};

		this.previewfield_maxwidth = function (f_obj) {
			var show_st, max_width, max_width_st;

			var cur_el_obj;
			var cur_el_obj_str;
			var all_values;
			var hash_str_all_values;

			if (cur_blockmain_st) {

				(show_st = settings['data']['main']['skin']['align']['show_st']),
					(max_width = settings['data']['main']['skin']['align']['max_width']),
					(max_width_st = settings['data']['main']['skin']['align']['max_width_st']);

				all_values = settings['data']['main']['skin']['align'];

				cur_el_obj = f_obj.find('.sfdc-container-fluid');
				cur_el_obj_str = '#' + settings.data.id + ' > .sfdc-container-fluid';
			} else {
			}

			hash_str_all_values = 'zgpb_' + settings.data.id + '_skin_align_' + cur_block_var;

			if (hash_check(hash_str_all_values, all_values)) {
				if ($('#' + hash_str_all_values)) {
					$('#' + hash_str_all_values).remove();
				}

				if (parseInt(show_st) === 1) {
					var str_ouput = '<style type="text/css" id="' + hash_str_all_values + '">';
					str_ouput += cur_el_obj_str + ' { ';
					str_ouput += 'max-width:' + max_width + 'px; ';
					str_ouput += 'margin-left: auto !important;';
					str_ouput += 'margin-right: auto !important;';

					str_ouput += '} ';
					str_ouput += '</style>';

					$('head').append(str_ouput);
				}
			}
		};

		this.setOptionsToPreview = function (vars) {
			var f_obj = elem;
			var block = (opt1 = vars['block']),
				opt1 = vars['opt1'],
				opt2 = vars['opt2'],
				opt3 = vars['opt3'],
				opt4 = vars['opt4'];

			cur_blockmain_st = true;
			cur_block_var = 0;
			if (parseInt(block) > 0) {
				cur_blockmain_st = false;
				cur_block_var = parseInt(block);
			}

			switch (String(opt1)) {
				case 'skin':
					switch (String(opt2)) {
						case 'align':
							switch (String(opt3)) {
								case 'show_st':
								case 'max_width':
								case 'max_width_st':
									this.previewfield_maxwidth(f_obj);
									break;
							}

							break;

						case 'margin':
							switch (String(opt3)) {
								case 'top':
									if (cur_blockmain_st) {
										f_obj.find('>.sfdc-container-fluid').attr('style', function (i, s) {
											return (s || '') + `margin-top: ${opt4}px !important;`;
										});
									} else {
										f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + block + '"] > .zgpb-fl-gs-block-inner').css('margin-top', opt4 + 'px');
									}

									break;
								case 'bottom':
									if (cur_blockmain_st) {
										f_obj.find('>.sfdc-container-fluid').attr('style', function (i, s) {
											return (s || '') + `margin-bottom: ${opt4}px !important;`;
										});
									} else {
										f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + block + '"] > .zgpb-fl-gs-block-inner').css('margin-bottom', opt4 + 'px');
									}
									break;
								case 'left':
									if (cur_blockmain_st) {
										f_obj.find('>.sfdc-container-fluid').attr('style', function (i, s) {
											return (s || '') + `margin-left: ${opt4}px !important;`;
										});
									} else {
										f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + block + '"] > .zgpb-fl-gs-block-inner').css('margin-left', opt4 + 'px');
									}
									break;
								case 'right':
									if (cur_blockmain_st) {
										f_obj.find('>.sfdc-container-fluid').attr('style', function (i, s) {
											return (s || '') + `margin-right: ${opt4}px !important;`;
										});
									} else {
										f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + block + '"] > .zgpb-fl-gs-block-inner').css('margin-right', opt4 + 'px');
									}
									break;
							}

							break;
						case 'padding':
							switch (String(opt3)) {
								case 'top':
									if (cur_blockmain_st) {
										f_obj.find('>.sfdc-container-fluid').attr('style', function (i, s) {
											return (s || '') + `padding-top: ${opt4}px !important;`;
										});
									} else {
										f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + block + '"] > .zgpb-fl-gs-block-inner').css('padding-top', opt4 + 'px');
									}

									break;
								case 'bottom':
									if (cur_blockmain_st) {
										f_obj.find('>.sfdc-container-fluid').attr('style', function (i, s) {
											return (s || '') + `padding-bottom: ${opt4}px !important;`;
										});
									} else {
										f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + block + '"] > .zgpb-fl-gs-block-inner').css('padding-bottom', opt4 + 'px');
									}
									break;
								case 'left':
									if (cur_blockmain_st) {
										f_obj.find('>.sfdc-container-fluid').attr('style', function (i, s) {
											return (s || '') + `padding-left: ${opt4}px !important;`;
										});
									} else {
										f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + block + '"] > .zgpb-fl-gs-block-inner').css('padding-left', opt4 + 'px');
									}
									break;
								case 'right':
									if (cur_blockmain_st) {
										f_obj.find('>.sfdc-container-fluid').attr('style', function (i, s) {
											return (s || '') + `padding-right: ${opt4}px !important;`;
										});
									} else {
										f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + block + '"] > .zgpb-fl-gs-block-inner').css('padding-right', opt4 + 'px');
									}
									break;
							}
							break;
						case 'text':
							switch (String(opt3)) {
								case 'color':
									if (cur_blockmain_st) {
										f_obj.find('.sfdc-container-fluid').css('color', opt4);
									} else {
										f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + block + '"] >.zgpb-fl-gs-block-inner').css('color', opt4);
									}

									break;
							}
							break;
						case 'background':
							skin_preview_background(f_obj);
							break;
						case 'border':
							skin_preview_border(f_obj);
							break;
						case 'border_radius':
							skin_preview_border_radius(f_obj);
							break;
						case 'shadow':
							skin_preview_shadow(f_obj);
							break;
					}
					break;
			}
		};

		var skin_preview_shadow = function (f_obj) {
			var show_st, color, h_shadow, v_shadow, blur;

			var cur_el_obj;
			var cur_el_obj_str;
			var all_values;
			var hash_str_all_values;

			if (cur_blockmain_st) {

				(show_st = settings['data']['main']['skin']['shadow']['show_st']),
					(color = settings['data']['main']['skin']['shadow']['color']),
					(h_shadow = settings['data']['main']['skin']['shadow']['h_shadow']),
					(v_shadow = settings['data']['main']['skin']['shadow']['v_shadow']),
					(blur = settings['data']['main']['skin']['shadow']['blur']);

				all_values = settings['data']['main']['skin']['shadow'];
				cur_el_obj = f_obj.find('.sfdc-container-fluid');
				cur_el_obj_str = '#' + settings.data.id + ' > .sfdc-container-fluid';
			} else {

				(show_st = settings['data']['blocks'][cur_block_var]['skin']['shadow']['show_st']),
					(color = settings['data']['blocks'][cur_block_var]['skin']['shadow']['color']),
					(h_shadow = settings['data']['blocks'][cur_block_var]['skin']['shadow']['h_shadow']),
					(v_shadow = settings['data']['blocks'][cur_block_var]['skin']['shadow']['v_shadow']),
					(blur = settings['data']['blocks'][cur_block_var]['skin']['shadow']['blur']);

				all_values = settings['data']['blocks'][cur_block_var]['skin']['shadow'];
				cur_el_obj = f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + cur_block_var + '"] >.zgpb-fl-gs-block-inner');
				cur_el_obj_str = '#' + settings.data.id + ' > .sfdc-container-fluid > .sfdc-row > .zgpb-fl-gs-block-style[data-zgpb-blocknum="' + cur_block_var + '"] >.zgpb-fl-gs-block-inner';
			}

			hash_str_all_values = 'zgpb_' + settings.data.id + '_skin_shadow_' + cur_block_var;

			if (hash_check(hash_str_all_values, all_values)) {
				if ($('#' + hash_str_all_values)) {
					$('#' + hash_str_all_values).remove();
				}

				if (parseInt(show_st) === 1) {
					var style;
					var str_ouput = '<style type="text/css" id="' + hash_str_all_values + '">';
					str_ouput += cur_el_obj_str + ' { ';
					style = h_shadow + 'px ' + v_shadow + 'px ' + blur + 'px ' + color;
					str_ouput += 'box-shadow:' + style + ';';

					str_ouput += '} ';
					str_ouput += '</style>';
					$('head').append(str_ouput);
				}
			}
		};

		var skin_preview_border_radius = function (f_obj) {
			var show_st, size;

			var cur_el_obj;
			var cur_el_obj_str;
			var all_values;
			var hash_str_all_values;

			if (cur_blockmain_st) {

				(show_st = settings['data']['main']['skin']['border_radius']['show_st']), (size = settings['data']['main']['skin']['border_radius']['size']);

				all_values = settings['data']['main']['skin']['border_radius'];
				cur_el_obj = f_obj.find('.sfdc-container-fluid');
				cur_el_obj_str = '#' + settings.data.id + ' > .sfdc-container-fluid';
			} else {
				(show_st = settings['data']['blocks'][cur_block_var]['skin']['border_radius']['show_st']), (size = settings['data']['blocks'][cur_block_var]['skin']['border_radius']['size']);

				all_values = settings['data']['blocks'][cur_block_var]['skin']['border_radius'];
				cur_el_obj = f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + cur_block_var + '"] >.zgpb-fl-gs-block-inner');
				cur_el_obj_str = '#' + settings.data.id + ' .zgpb-fl-gs-block-style[data-zgpb-blocknum="' + cur_block_var + '"] >.zgpb-fl-gs-block-inner';
			}

			hash_str_all_values = 'zgpb_' + settings.data.id + '_skin_borderradius_' + cur_block_var;

			if (hash_check(hash_str_all_values, all_values)) {
				if ($('#' + hash_str_all_values)) {
					$('#' + hash_str_all_values).remove();
				}

				if (parseInt(show_st) === 1) {
					var str_ouput = '<style type="text/css" id="' + hash_str_all_values + '">';
					str_ouput += cur_el_obj_str + ' { ';

					str_ouput += 'border-radius:' + size + 'px;';

					str_ouput += '} ';
					str_ouput += '</style>';
					$('head').append(str_ouput);
				}
			}
		};

		var skin_preview_border = function (f_obj) {
			var show_st, color, color_focus_st, color_focus, type, width;

			var cur_el_obj;
			var cur_el_obj_str;
			var cur_el_obj_str_alt;
			var all_values;
			var hash_str_all_values;

			if (cur_blockmain_st) {

				(show_st = settings['data']['main']['skin']['border']['show_st']),
					(color = settings['data']['main']['skin']['border']['color']),
					(color_focus_st = settings['data']['main']['skin']['border']['color_focus_st']),
					(color_focus = settings['data']['main']['skin']['border']['color_focus']),
					(type = settings['data']['main']['skin']['border']['type']),
					(width = settings['data']['main']['skin']['border']['width']);

				all_values = settings['data']['main']['skin']['border'];
				cur_el_obj = f_obj.find('.sfdc-container-fluid');
				cur_el_obj_str = '#' + settings.data.id + ' > .sfdc-container-fluid';
			} else {
				(show_st = settings['data']['blocks'][cur_block_var]['skin']['border']['show_st']),
					(color = settings['data']['blocks'][cur_block_var]['skin']['border']['color']),
					(color_focus_st = settings['data']['blocks'][cur_block_var]['skin']['border']['color_focus_st']),
					(color_focus = settings['data']['blocks'][cur_block_var]['skin']['border']['color_focus']),
					(type = settings['data']['blocks'][cur_block_var]['skin']['border']['type']),
					(width = settings['data']['blocks'][cur_block_var]['skin']['border']['width']);

				all_values = settings['data']['blocks'][cur_block_var]['skin']['border'];
				cur_el_obj = f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + cur_block_var + '"] >.zgpb-fl-gs-block-inner');
				cur_el_obj_str = '#' + settings.data.id + ' > .sfdc-container-fluid > .sfdc-row >  .zgpb-fl-gs-block-style[data-zgpb-blocknum="' + cur_block_var + '"] >.zgpb-fl-gs-block-inner:first-child ';
			}

			hash_str_all_values = 'zgpb_' + settings.data.id + '_skin_border_' + cur_block_var;

			if (hash_check(hash_str_all_values, all_values)) {
				if ($('#' + hash_str_all_values)) {
					$('#' + hash_str_all_values).remove();
				}

				var border_sty;
				if (parseInt(show_st) === 1) {
					var str_ouput = '<style type="text/css" id="' + hash_str_all_values + '">';
					str_ouput += cur_el_obj_str + ' { ';

					border_sty = width + 'px';
					if (parseInt(type) === 1) {
						border_sty += ' solid ';
					} else {
						border_sty += ' dotted ';
					}
					border_sty += color;
					str_ouput += 'border:' + border_sty + ';';

					str_ouput += '} ';

					str_ouput += '</style>';
					$('head').append(str_ouput);
				}
			}
		};

		var skin_preview_background = function (f_obj) {
			var show_st,
				type,
				cl_start_color,
				cl_end_color,
				cl_solid_color,
				img_source,
				img_repeat,
				img_position,
				img_attachment,
				img_scale,
				img_overlay_color,
				img_overlay_opacity,
				img_size_type,
				img_size_len,
				opacity;

			var cur_el_obj;
			var cur_el_obj_str;
			var all_values;
			var hash_str_all_values;
			if (cur_blockmain_st) {

				(show_st = settings['data']['main']['skin']['background']['show_st']),
					(type = settings['data']['main']['skin']['background']['type']),
					(cl_start_color = settings['data']['main']['skin']['background']['cl_start_color']),
					(cl_end_color = settings['data']['main']['skin']['background']['cl_end_color']),
					(cl_solid_color = settings['data']['main']['skin']['background']['cl_solid_color']),
					(img_source = settings['data']['main']['skin']['background']['img_source']),
					(img_repeat = settings['data']['main']['skin']['background']['img_repeat']),
					(img_position = settings['data']['main']['skin']['background']['img_position']),
					(img_attachment = settings['data']['main']['skin']['background']['img_attachment']),
					(img_scale = settings['data']['main']['skin']['background']['img_scale']),
					(img_overlay_color = settings['data']['main']['skin']['background']['img_overlay_color']),
					(img_overlay_opacity = settings['data']['main']['skin']['background']['img_overlay_opacity']),
					(img_size_type = settings['data']['main']['skin']['background']['img_size_type']),
					(img_size_len = settings['data']['main']['skin']['background']['img_size_len']),
					(opacity = settings['data']['main']['skin']['background']['opacity']);
				all_values = settings['data']['main']['skin']['background'];

				cur_el_obj = f_obj.find('.sfdc-container-fluid');
				cur_el_obj_str = '#' + settings.data.id + ' > .sfdc-container-fluid';
			} else {
				(show_st = settings['data']['blocks'][cur_block_var]['skin']['background']['show_st']),
					(type = settings['data']['blocks'][cur_block_var]['skin']['background']['type']),
					(cl_start_color = settings['data']['blocks'][cur_block_var]['skin']['background']['cl_start_color']),
					(cl_end_color = settings['data']['blocks'][cur_block_var]['skin']['background']['cl_end_color']),
					(cl_solid_color = settings['data']['blocks'][cur_block_var]['skin']['background']['cl_solid_color']),
					(img_source = settings['data']['blocks'][cur_block_var]['skin']['background']['img_source']),
					(img_repeat = settings['data']['blocks'][cur_block_var]['skin']['background']['img_repeat']),
					(img_position = settings['data']['blocks'][cur_block_var]['skin']['background']['img_position']),
					(img_attachment = settings['data']['blocks'][cur_block_var]['skin']['background']['img_attachment']),
					(img_scale = settings['data']['blocks'][cur_block_var]['skin']['background']['img_scale']),
					(img_overlay_color = settings['data']['blocks'][cur_block_var]['skin']['background']['img_overlay_color']),
					(img_overlay_opacity = settings['data']['blocks'][cur_block_var]['skin']['background']['img_overlay_opacity']),
					(img_size_type = settings['data']['main']['skin']['background']['img_size_type']),
					(img_size_len = settings['data']['main']['skin']['background']['img_size_len']),
					(opacity = settings['data']['blocks'][cur_block_var]['skin']['background']['opacity']);
				all_values = settings['data']['blocks'][cur_block_var]['skin']['background'];
				cur_el_obj = f_obj.find('.zgpb-fl-gs-block-style[data-zgpb-blocknum="' + cur_block_var + '"] >.zgpb-fl-gs-block-inner');
				cur_el_obj_str = '#' + settings.data.id + ' .zgpb-fl-gs-block-style[data-zgpb-blocknum="' + cur_block_var + '"] >.zgpb-fl-gs-block-inner';
			}

			hash_str_all_values = 'zgpb_' + settings.data.id + '_skin_background_' + cur_block_var;

			if (hash_check(hash_str_all_values, all_values)) {
				if ($('#' + hash_str_all_values)) {
					$('#' + hash_str_all_values).remove();
				}

				if (parseInt(show_st) === 1) {
					var str_ouput = '<style type="text/css" id="' + hash_str_all_values + '">';
					str_ouput += cur_el_obj_str + ' { ';

					switch (parseInt(type)) {
						case 2:

							if (cl_start_color && cl_end_color) {
								str_ouput += 'background-color:' + cl_start_color + ';';
								str_ouput += 'background-image:' + '-webkit-linear-gradient(top, ' + cl_start_color + ', ' + cl_end_color + ')' + ';';
								str_ouput += 'background-image:' + '-moz-linear-gradient(top, ' + cl_start_color + ', ' + cl_end_color + ')' + ';';
								str_ouput += 'background-image:' + '-ms-linear-gradient(top, ' + cl_start_color + ', ' + cl_end_color + ')' + ';';
								str_ouput += 'background-image:' + '-o-linear-gradient(top, ' + cl_start_color + ', ' + cl_end_color + ')' + ';';
								str_ouput += 'background-image:' + 'linear-gradient(to bottom, ' + cl_start_color + ',' + cl_end_color + ')' + ';';
							}
							break;
						case 1:
						default:

							if (cl_solid_color) {
								str_ouput += 'background-color:' + cl_solid_color + ';';
							}

							break;
					}

					if (img_source) {
						str_ouput += 'background-image: url("' + img_source + '");';
					}

					var tmp_bg_str;
					switch (parseInt(img_size_type)) {
						case 1:
							tmp_bg_str = img_size_len;
							break;
						case 2:
							tmp_bg_str = img_size_len;
							break;
						case 3:
							tmp_bg_str = 'cover';
							break;
						case 4:
							tmp_bg_str = 'contain';
							break;
						case 5:
							tmp_bg_str = 'initial';
							break;
						case 6:
							tmp_bg_str = 'inherit';
							break;
						case 0:
						default:
							tmp_bg_str = 'auto';
							break;
					}
					str_ouput += 'background-size: ' + tmp_bg_str + ';';

					switch (parseInt(img_repeat)) {
						case 1:
							tmp_bg_str = 'repeat-x';
							break;
						case 2:
							tmp_bg_str = 'repeat-y';
							break;
						case 3:
							tmp_bg_str = 'no-repeat';
							break;
						case 4:
							tmp_bg_str = 'initial';
							break;
						case 5:
							tmp_bg_str = 'inherit';
							break;
						case 0:
						default:
							tmp_bg_str = 'auto';
							break;
					}
					str_ouput += 'background-repeat: ' + tmp_bg_str + ';';

					str_ouput += 'background-position: ' + img_position + ';';

					str_ouput += '} ';
					str_ouput += '</style>';
					$('head').append(str_ouput);
				}
			}
		};

		var hash_check = function (opt_str_hash, all_values) {
			var hash_str_all_values = opt_str_hash;

			var valhash = CryptoJS.MD5(JSON.stringify(all_values));

			var f_checkhash = getInnerVariable(hash_str_all_values);

			if (String(f_checkhash) === String(valhash)) {
				return false;
			} else {
				setInnerVariable(hash_str_all_values, CryptoJS.MD5(JSON.stringify(all_values)));
				return true;
			}
		};

		this.updateVarData = function (id) {
			$('#' + id).data('zgpb-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				this.enableSettingOptions_process(settings.data, false, true, null);

			}
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};

		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setStep = function (step) {
			field_step = step;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2;
			if (options.hasOwnProperty('data')) {
				settings2 = $.extend(true, {}, settings, options);
			} else {
				settings2 = $.extend(true, {}, settings, { data: options });
			}

			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.createBlockAttributes = function () {
			var num_blocks = settings.data.type;

			var tmp_new_block = {};
			switch (parseInt(num_blocks)) {
				case 1:
					tmp_new_block[1] = $.extend(true, {}, tmp_init_data);
					break;
				case 2:
					tmp_new_block[1] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[2] = $.extend(true, {}, tmp_init_data);
					break;
				case 3:
					tmp_new_block[1] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[2] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[3] = $.extend(true, {}, tmp_init_data);
					break;
				case 4:
					tmp_new_block[1] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[2] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[3] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[4] = $.extend(true, {}, tmp_init_data);
					break;
				case 5:
					tmp_new_block[1] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[2] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[3] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[4] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[5] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[6] = $.extend(true, {}, tmp_init_data);
					break;
				case 6:
					tmp_new_block[1] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[2] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[3] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[4] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[5] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[6] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[7] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[8] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[9] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[10] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[11] = $.extend(true, {}, tmp_init_data);
					tmp_new_block[12] = $.extend(true, {}, tmp_init_data);
					break;
			}

			settings.data.main = $.extend(true, {}, tmp_init_data);
			settings.data.blocks = tmp_new_block;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				block = tmp_vars['block'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			if (parseInt(block) > 0) {
				var block_index = parseInt(block);
				rocketform.setUiData8('steps_src', field_step, String(id), 'blocks', block_index, String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			} else {
				rocketform.setUiData7('steps_src', field_step, String(id), 'main', String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview, addt) {
			if (update_modal) {
				var tab = $('#uifm-field-opt-content');
				rocketform.fields2_events_bswitch(tab);
				rocketform.fields2_events_groupbtn(tab);
				rocketform.fields2_events_cpicker(tab);
				rocketform.fields2_events_spinner(tab);
				rocketform.fields2_events_bgimages(tab);
				rocketform.fields2_events_slider(tab);
				rocketform.fields2_events_txts(tab);
				rocketform.fields2_events_general();
			}

			var tmp_vars;

			var block = addt ? addt['block'] : 0;

			var cur_blockmain_st = true;
			if (parseInt(block) > 0) {
				cur_blockmain_st = false;
			}


			if (cur_blockmain_st) {
				$('#zgpb_fld_col_style_wrapper').show();
			} else {
				$('#zgpb_fld_col_style_wrapper').hide();
			}

			var fldname = settings.data['field_name'] || '';
			if (cur_blockmain_st) {
				if (fldname) {
					$('#uifm_fld_main_fldname').val(fldname);
				}
			} else {
				var str_col = $('#zgfm-field-col-fldname-lbl-bl2').html();
				$('#zgfm-field-col-fldname-lbl-bl1').html(fldname + ' - ');
			}

			$.each(f_data, function (index3, value3) {
				if ($.isPlainObject(value3)) {
					$.each(value3, function (index4, value4) {
						if ($.isPlainObject(value4)) {
							$.each(value4, function (index5, value5) {
								if ($.isPlainObject(value5)) {
									$.each(value5, function (index6, value6) {
										if ($.isPlainObject(value6)) {
											$.each(value6, function (index7, value7) {
												tmp_vars = [];

												if (String(index3) === 'main') {
													tmp_vars['block'] = 0;
												} else {
													tmp_vars['block'] = parseInt(index4);
												}

												tmp_vars['opt1'] = index5;
												tmp_vars['opt2'] = index6;
												tmp_vars['opt3'] = index7;
												tmp_vars['opt4'] = value7;

												if (cur_blockmain_st === false && String(index3) === 'blocks' && parseInt(block) === parseInt(index4)) {
													if (update_modal) {
														obj_main.setOptionsToModal(tmp_vars);
													}
												}

												if (update_preview) {
													obj_main.setOptionsToPreview(tmp_vars);
												}
											});
										} else {
											if (String(index3) === 'main') {
												tmp_vars = [];
												tmp_vars['block'] = 0;
												tmp_vars['opt1'] = index4;
												tmp_vars['opt2'] = index5;
												tmp_vars['opt3'] = index6;
												tmp_vars['opt4'] = value6;

												if (cur_blockmain_st === true) {
													if (update_modal) {
														obj_main.setOptionsToModal(tmp_vars);
													}
												}

												if (update_preview) {
													obj_main.setOptionsToPreview(tmp_vars);
												}
											}
										}
									});
								}
							});
						}
					});
				} else {
				}
			});

		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			this.enableSettingOptions_process(f_data, true, true, addt);

			rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);
			if (field_oncreation) {
				rocketform.loading_boxField(f_data['id'], 0);
				field_oncreation = false;
			}
		};

		this.getOnProcessStatus = function () {
			return field_onprocess;
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};
	};

	$.fn.zgpbld_gridsystem = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('zgpbld_gridsystem')) return;

			var myplugin = new zgpbld_gridsystem(this, options);

			element.data('zgpbld_gridsystem', myplugin);
		});
	};
})($uifm);

(function ($) {
	var d = $(document); 
	var h = $('head'); 
	var drag = null; 
	var tables = []; 
	var count = 0; 

	var ID = 'id';
	var PX = 'px';
	var SIGNATURE = 'JColResizer';

	var I = parseInt;
	var M = Math;
	var ie = false;
	var S;
	try {
		S = sessionStorage;
	} catch (e) {} 

	h.append(
		"<style type='text/css'>  .JColResizer{table-layout:fixed;} .JColResizer td, .JColResizer th{overflow:hidden;padding-left:0!important; padding-right:0!important;}  .JCLRgrips{ height:0px; position:relative;} .JCLRgrip{margin-left:-5px; position:absolute; z-index:5; } .JCLRgrip .JColResizer{position:absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;top:0px} .JCLRLastGrip{position:absolute; width:1px; } .JCLRgripDrag{ border-left:1px dotted black;	}</style>"
	);

	var init = function (tb, options) {
		var t = $(tb); 
		if (options.disable) return destroy(t); 
		var id = (t.id = t.attr(ID) || SIGNATURE + count++); 
		t.p = options.postbackSafe; 
		if (!t.is('table') || tables[id]) return; 
		t.addClass(SIGNATURE).attr(ID, id).before('<div class="JCLRgrips"/>'); 
		t.opt = options;
		t.g = [];
		t.c = [];
		t.w = t.width();
		t.gc = t.prev(); 
		if (options.marginLeft) t.gc.css('marginLeft', options.marginLeft); 
		if (options.marginRight) t.gc.css('marginRight', options.marginRight); 
		t.cs = I(ie ? tb.cellSpacing || tb.currentStyle.borderSpacing : t.css('border-spacing')) || 2; 
		t.b = I(ie ? tb.border || tb.currentStyle.borderLeftWidth : t.css('border-left-width')) || 1; 
		tables[id] = t; 
		createGrips(t); 
	};

	destroy = function (t) {
		var id = t.attr(ID),
			t = tables[id]; 
		if (!t || !t.is('table')) return; 
		t.removeClass(SIGNATURE).gc.remove(); 
		delete tables[id]; 
	};

	var createGrips = function (t) {
		var th = t.find('>thead>tr>th,>thead>tr>td'); 
		if (!th.length) th = t.find('>tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td'); 
		t.cg = t.find('col'); 
		t.ln = th.length; 
		if (t.p && S && S[t.id]) memento(t, th); 
		th.each(function (i) {
			var c = $(this); 
			var g = $(t.gc.append('<div class="JCLRgrip"></div>')[0].lastChild); 
			g.t = t;
			g.i = i;
			g.c = c;
			c.w = c.width();
			c.blocks = c.attr('data-blocks'); 
			c.mpercent = c.attr('data-maxpercent');
			t.g.push(g);
			t.c.push(c); 
			c.width(c.w).removeAttr('width'); 
			if (i < t.ln - 1)
				g.mousedown(onGripMouseDown)
					.append(t.opt.gripInnerHtml)
					.append('<div class="' + SIGNATURE + '" style="cursor:' + t.opt.hoverCursor + '"></div>');
			else g.addClass('JCLRLastGrip').removeClass('JCLRgrip'); 
			g.data(SIGNATURE, { i: i, t: t.attr(ID) }); 
		});
		t.cg.removeAttr('width'); 
		syncGrips(t); 
		t.find('td, th')
			.not(th)
			.not('table th, table td')
			.each(function () {
				$(this).removeAttr('width'); 
			});
	};

	var memento = function (t, th) {
		var w,
			m = 0,
			i = 0,
			aux = [];
		if (th) {
			t.cg.removeAttr('width');
			if (t.opt.flush) {
				S[t.id] = '';
				return;
			} 
			w = S[t.id].split(';'); 
			for (; i < t.ln; i++) {
				aux.push((100 * w[i]) / w[t.ln] + '%'); 
				th.eq(i).css('width', aux[i]); 
			}
			for (i = 0; i < t.ln; i++) t.cg.eq(i).css('width', aux[i]); 
		} else {
			S[t.id] = ''; 
			for (i in t.c) {
				w = t.c[i].width(); 
				S[t.id] += w + ';'; 
				m += w; 
			}
			S[t.id] += m; 
		}
	};

	var syncGrips = function (t) {
		var temp_x;
		t.gc.width(t.w); 
		for (var i = 0; i < t.ln; i++) {
			var c = t.c[i];
			temp_x = c.offset().left - t.offset().left + c.outerWidth() + t.cs / 2;
			t.g[i].css({
				left: setcollimits(t, temp_x, i, false) + PX,
				height: t.opt.headerOnly ? t.c[0].outerHeight() : t.outerHeight()
			});
		}
	};

	var syncCols = function (t, i, isOver) {
		var inc = drag.x - drag.l,
			c = t.c[i],
			c2 = t.c[i + 1];
		var w = c.w + inc;
		var w2 = c2.w - inc; 
		c.width(w + PX);
		c2.width(w2 + PX); 
		c.attr('data-blocks', t.c[i].blocks);
		c2.attr('data-blocks', t.c[i + 1].blocks);
		c.attr('data-maxpercent', t.c[i].mpercent);
		t.cg.eq(i).width(w + PX);
		t.cg.eq(i + 1).width(w2 + PX);
		if (isOver) {
			c.w = w;
			c2.w = w2;
		}
	};

	var setboundlimits = function (t, x, flag, drag_i) {
		var temp_total = t.w;
		var temp_range = Math.round((100 * x) / temp_total);

		var theArray = [8.333, 16.666, 25, 33.333, 41.666, 50, 58.333, 66.666, 75, 83.333, 91.666];
		var goal = temp_range;
		var closest = null;
		var temp_index = null;

		$.each(theArray, function (index, element) {
			if (closest == null || Math.abs(element - goal) < Math.abs(closest - goal)) {
				closest = element;
				temp_index = index;
			}
		});

		if (flag) {
			if (drag_i == parseInt(t.ln) - 2) {
			} else {
				temp_index = temp_index - 1;
			}
			closest = theArray[temp_index];
		} else {
			if (drag_i == 0) {
			} else {
				temp_index = temp_index + 1;
			}
			closest = theArray[temp_index];
		}

		closest = M.max(8.333, M.min(91.666, closest));

		var temp_number = (parseFloat(temp_total) * parseFloat(closest)) / 100;

		return temp_number;
	};

	var setcollimits = function (t, x, i, flag) {
		var temp_total = t.w;
		var goal = Math.round((100 * x) / temp_total);
		var theArray = [0, 8.3, 16.6, 25, 33.3, 41.6, 50, 58.3, 66.6, 75, 83.3, 91.6, 100];
		var closest = null;
		var temp_index = null;

		$.each(theArray, function (index, element) {
			if (closest == null || Math.abs(element - goal) < Math.abs(closest - goal)) {
				closest = element;
				temp_index = index;
			}
		});

		closest = M.max(8.3, M.min(91.6, closest));

		if (flag === true) {
			var found = $.map(theArray, function (val, index) {
				return val == closest ? index : null;
			});

			var temp_c, temp_c1, temp_max, temp_min, temp_prev, temp_prev_val, temp_block_2, temp_block_1;
			temp_c = t.c[i].mpercent;
			temp_c1 = t.c[i + 1].mpercent;

			if (t.c[i - 1] === undefined) {
				temp_prev_val = 0;
			} else {
				temp_prev_val = t.c[i - 1].mpercent;
			}
			temp_min = parseFloat(temp_c) - parseFloat(temp_prev_val);
			temp_max = parseFloat(temp_c1) - parseFloat(temp_c);
			temp_block_1 = (12 * temp_min) / 100;
			temp_block_2 = (12 * temp_max) / 100;
			t.c[i].blocks = Math.round(temp_block_1);
			t.c[i + 1].blocks = Math.round(temp_block_2);
			t.c[i].mpercent = closest;
		}

		var temp_number = (parseFloat(temp_total) * parseFloat(closest)) / 100;


		return temp_number;
	};

	var onGripDrag = function (e) {
		if (!drag) return;
		var t = drag.t; 
		var x = e.pageX - drag.ox + drag.l; 
		var mw = t.opt.minWidth,
			i = drag.i; 
		var l = t.cs * 1.5 + mw + t.b;

		var max = i == t.ln - 1 ? t.w - l : t.g[i + 1].position().left - t.cs - mw; 
		max = setboundlimits(t, max, true, drag.i);
		var min = i ? t.g[i - 1].position().left + t.cs + mw : l; 
		min = setboundlimits(t, min, false, drag.i);

		x = M.max(min, M.min(max, x)); 
		x = setcollimits(t, x, i, true);
		drag.x = x;
		drag.css('left', x + PX); 

		if (t.opt.liveDrag) {
			syncCols(t, i);
			syncGrips(t); 
			var cb = t.opt.onDrag; 
			if (cb) {
				e.currentTarget = t[0];
				cb(e);
			} 
		}

		return false; 
	};

	var onGripDragOver = function (e) {
		d.unbind('mousemove.' + SIGNATURE).unbind('mouseup.' + SIGNATURE);
		$('head :last-child').remove(); 
		if (!drag) return;
		drag.removeClass(drag.t.opt.draggingClass); 
		var t = drag.t,
			cb = t.opt.onResize; 
		if (drag.x) {
			syncCols(t, drag.i, true);
			syncGrips(t); 
			if (cb) {
				e.currentTarget = t[0];
				cb(e);
			} 
		}
		if (t.p && S) memento(t); 
		drag = null; 
	};

	var onGripMouseDown = function (e) {
		var o = $(this).data(SIGNATURE); 
		var t = tables[o.t],
			g = t.g[o.i]; 
		g.ox = e.pageX;
		g.l = g.position().left; 
		d.bind('mousemove.' + SIGNATURE, onGripDrag).bind('mouseup.' + SIGNATURE, onGripDragOver); 
		h.append("<style type='text/css'>*{cursor:" + t.opt.dragCursor + '!important}</style>'); 
		g.addClass(t.opt.draggingClass); 
		drag = g; 
		if (t.c[o.i].l) {
			for (var i = 0, c; i < t.ln; i++) {
				c = t.c[i];
				c.l = false;
				c.w = c.width();
			}
		}
		return false; 
	};

	var onResize = function () {
		for (t in tables) {
			var t = tables[t],
				i,
				mw = 0;
			t.removeClass(SIGNATURE); 
			if (t.w != t.width()) {
				t.w = t.width(); 
				for (i = 0; i < t.ln; i++) mw += t.c[i].w; 
				for (i = 0; i < t.ln; i++) t.c[i].css('width', M.round((1000 * t.c[i].w) / mw) / 10 + '%').l = true;
			}
			syncGrips(t.addClass(SIGNATURE));
		}
	};


	$.fn.extend({
		colResizable: function (options) {
			var defaults = {
				draggingClass: '', 
				gripInnerHtml: "<div class='uiform-grip-intersect'></div>", 
				liveDrag: true, 
				minWidth: 15, 
				headerOnly: false, 
				hoverCursor: 'e-resize', 
				dragCursor: 'e-resize', 
				postbackSafe: false, 
				flush: false, 
				marginLeft: null, 
				marginRight: null, 
				disable: false, 
				onDrag: null, 
				onResize: null 
			};
			var node = this;
			var options = $.extend(defaults, options);
			return this.each(function () {
				function resize_grid() {
					onResize();
				}

				$(window).resize(function () {
					resize_grid();
				});
				init(this, options);
			});
		}
	});
})($uifm);

(function ($) {
	var uifm_panels = [];
	var uifm_width_panel = 0;
	var uifm_max_width_panel = 0;
	var uifm_width_panel_center = 0;
	var uifm_width_panel_left = 0;
	var uifm_width_panel_right = 0;
	var uipanel_object;
	var uipanel_main_content;
	var uifm_footer_credit;
	var uipanel_percentage = 1;
	var uifm_panelleft_width = 262;
	var uifm_panelright_width = 520;

	var uifm_main_height = 0;
	var uifm_allpanel_height = 0;

	var init = function (tb, options) {
		uipanel_main_content = $('#rocketform-bk-content');
		uifm_footer_credit = $('#wpfooter') || null;
		uipanel_object = $(tb);
		uifm_panels['left'] = uipanel_object.find('.uifm-edit-panel-left');
		uifm_panels['center'] = uipanel_object.find('.uifm-edit-panel-center');
		uifm_panels['right'] = uipanel_object.find('.uifm-edit-panel-right');

		uifm_max_width_panel = uifm_width_panel = $('.uiform-editing-main').width();

		calculatePanels();
	};
	var onPanelResize = function () {
		uifm_width_panel = $('.uiform-editing-main').width();
		if (uifm_width_panel >= uifm_max_width_panel) {
			uifm_max_width_panel = uifm_width_panel;
		} else {
			uifm_width_panel = uifm_max_width_panel;
		}

		calculatePanels();
	};
	var calculatePanels = function () {

		if ($('#uifm-panel-arrow-left').hasClass('uifm-layout-toggler-open')) {
			var innerwidthLeft = uifm_panelleft_width;
			innerwidthLeft += 17;
		} else {
			innerwidthLeft = 10;
		}
		var newWidthPanelLeft;

		if (uipanel_percentage) {
			newWidthPanelLeft = ((parseFloat(innerwidthLeft) * 100) / parseFloat(uifm_width_panel)).toFixed(3);
		} else {
			newWidthPanelLeft = innerwidthLeft;
		}

		var innerwidthRight;
		if ($('#uifm-panel-arrow-right').hasClass('uifm-layout-toggler-open')) {
			innerwidthRight = uifm_panelright_width;
		} else {
			innerwidthRight = 10;
		}

		var newWidthPanelRight;
		if (uipanel_percentage) {
			newWidthPanelRight = ((parseFloat(innerwidthRight) * 100) / parseFloat(uifm_width_panel)).toFixed(3);
		} else {
			newWidthPanelRight = innerwidthRight;
		}

		var newWidthPanelCenter;
		if (uipanel_percentage) {
			newWidthPanelCenter = 100 - parseFloat(newWidthPanelRight) - parseFloat(newWidthPanelLeft);
		} else {
			newWidthPanelCenter = uifm_width_panel - parseFloat(newWidthPanelRight) - parseFloat(newWidthPanelLeft);
		}

		if (uipanel_percentage) {
			uipanel_object.find('.uifm-edit-panel-left').css('width', newWidthPanelLeft + '%');
		} else {
			uipanel_object.find('.uifm-edit-panel-left').css('width', newWidthPanelLeft + 'px');
		}

		uifm_width_panel_left = newWidthPanelLeft;
		if (uipanel_percentage) {
			uipanel_object.find('.uifm-edit-panel-center').css('width', newWidthPanelCenter + '%');
		} else {
			uipanel_object.find('.uifm-edit-panel-center').css('width', newWidthPanelCenter + 'px');
		}

		uifm_width_panel_center = newWidthPanelCenter;

		if (uipanel_percentage) {
			uipanel_object.find('.uifm-edit-panel-right').css('width', newWidthPanelRight + '%');
		} else {
			uipanel_object.find('.uifm-edit-panel-right').css('width', newWidthPanelRight + 'px');
		}
		uifm_width_panel_right = newWidthPanelRight;


		var tmp_main_height = uipanel_main_content.height();
		if (parseInt(tmp_main_height) === 0) {
			return;
		}

		if (parseInt(uifm_panels['left'].find('.uiform-builder-fields').height()) === 0) {
			return;
		}

		var tmp_main_pos = uipanel_main_content.offset();
		var tmp_main_pos_top = tmp_main_pos.top;
		var tmp_main_pos_bottom = parseFloat(tmp_main_pos_top) + tmp_main_height;

		if (parseInt(tmp_main_pos_bottom) === 0) {
			return;
		}

		var tmp_footer_pos = uifm_footer_credit.offset();
		var tmp_footer_pos_left = tmp_footer_pos.left;
		var tmp_footer_pos_top = tmp_footer_pos.top;

		if (tmp_footer_pos_top > tmp_main_pos_bottom) {
			var tmp_diff = tmp_footer_pos_top - tmp_main_pos_bottom;
			uifm_main_height = tmp_main_height + tmp_diff - 100;
		} else {
			uifm_main_height = tmp_main_height;
		}

		uipanel_main_content.css('height', uifm_main_height + 'px');

		var tmp_menu_height;
		var tmp_height_ret;
		var tmp_pleft_height;
		var tmp_diff_inner_h;
		tmp_menu_height = $('.uiformc-menu-wrap').first().height();
		tmp_pleft_height = uifm_panels['left'].find('.uiform-builder-fields').height();

		if (tmp_footer_pos_top > tmp_main_pos_bottom) {
			tmp_diff_inner_h = uifm_main_height - tmp_menu_height - tmp_pleft_height;
			if (tmp_diff_inner_h > 0) {
				tmp_height_ret = tmp_pleft_height + tmp_diff_inner_h;
			} else {
				tmp_height_ret = tmp_pleft_height;
			}
		} else {
			tmp_height_ret = tmp_pleft_height;
		}
		uifm_allpanel_height = tmp_height_ret;

		uifm_panels['left'].find('.uiform-builder-fields').height(uifm_allpanel_height);

		uifm_panels['center'].find('.uiform-builder-preview').height(uifm_allpanel_height);

		uifm_panels['right'].find('.uiform-builder-data').height(uifm_allpanel_height);

		$('.uiform-builder-maintab-container .uiform-tab-content').height(parseFloat(uifm_allpanel_height - 170));
	};

	var onTogglerLeftPanel = function () {
		var newWidthPanelLeft;
		var bothWidthPanel;
		var newWidthPanelCenter;
		if ($('#uifm-panel-arrow-left').hasClass('uifm-layout-toggler-open')) {
			$('#uifm-panel-arrow-left').removeClass('uifm-layout-toggler-open');
			if (uipanel_percentage) {
				newWidthPanelLeft = ((parseFloat(10) * 100) / parseFloat(uifm_width_panel)).toFixed(3);
			} else {
				newWidthPanelLeft = 10;
			}

			bothWidthPanel = parseFloat(uifm_width_panel_left) + parseFloat(uifm_width_panel_center);
			newWidthPanelCenter = parseFloat(bothWidthPanel) - parseFloat(newWidthPanelLeft);

			if (uipanel_percentage) {
				uipanel_object.find('.uifm-edit-panel-left').css('width', newWidthPanelLeft + '%');
				uipanel_object.find('.uifm-edit-panel-center').css('width', newWidthPanelCenter + '%');
			} else {
				uipanel_object.find('.uifm-edit-panel-left').css('width', newWidthPanelLeft + 'px');
				uipanel_object.find('.uifm-edit-panel-center').css('width', newWidthPanelCenter + 'px');
			}

			uipanel_object.find('.uifm-edit-panel-left').addClass('uifm-panel-tog-left-closed');

			$('#uifm-panel-arrow-left').find('.uifm-arrow-open').css('display', 'none');
			$('#uifm-panel-arrow-left').find('.uifm-arrow-closed').css('display', 'block');
			$('.uiform-editing-main .uiform-builder-fields').hide();
			$('#uifm-panel-arrow-left').addClass('uifm-layout-toggler-close');
			$('#uifm-panel-arrow-left').attr('title', 'Open');
		} else {
			$('#uifm-panel-arrow-left').removeClass('uifm-layout-toggler-close');
			uipanel_object.find('.uifm-edit-panel-left').removeClass('uifm-panel-tog-left-closed');
			var innerwidthLeft = uifm_panelleft_width;
			innerwidthLeft += 17;
			if (uipanel_percentage) {
				newWidthPanelLeft = ((parseFloat(innerwidthLeft) * 100) / parseFloat(uifm_width_panel)).toFixed(3);
			} else {
				newWidthPanelLeft = innerwidthLeft;
			}

			bothWidthPanel = parseFloat(uifm_width_panel_left) + parseFloat(uifm_width_panel_center);
			newWidthPanelCenter = parseFloat(bothWidthPanel) - parseFloat(newWidthPanelLeft);

			if (uipanel_percentage) {
				uipanel_object.find('.uifm-edit-panel-left').css('width', newWidthPanelLeft + '%');
				uipanel_object.find('.uifm-edit-panel-center').css('width', newWidthPanelCenter + '%');
			} else {
				uipanel_object.find('.uifm-edit-panel-left').css('width', newWidthPanelLeft + 'px');
				uipanel_object.find('.uifm-edit-panel-center').css('width', newWidthPanelCenter + 'px');
			}

			$('#uifm-panel-arrow-left').find('.uifm-arrow-open').css('display', 'block');
			$('#uifm-panel-arrow-left').find('.uifm-arrow-closed').css('display', 'none');
			$('.uiform-editing-main .uiform-builder-fields').show();
			$('#uifm-panel-arrow-left').addClass('uifm-layout-toggler-open');
			$('#uifm-panel-arrow-left').attr('title', 'Close');
		}
		$(window).trigger('resize');
	};

	var onTogglerRightPanel = function () {
		var newWidthPanelRight;
		var bothWidthPanel;
		var newWidthPanelCenter;
		if ($('#uifm-panel-arrow-right').hasClass('uifm-layout-toggler-open')) {
			$('#uifm-panel-arrow-right').removeClass('uifm-layout-toggler-open');
			newWidthPanelRight = ((parseFloat(10) * 100) / parseFloat(uifm_width_panel)).toFixed(3);

			bothWidthPanel = parseFloat(uifm_width_panel_right) + parseFloat(uifm_width_panel_center);

			newWidthPanelCenter = parseFloat(bothWidthPanel) - parseFloat(newWidthPanelRight);

			uipanel_object.find('.uifm-edit-panel-right').css('width', newWidthPanelRight + '%');
			uipanel_object.find('.uifm-edit-panel-center').css('width', newWidthPanelCenter + '%');

			uipanel_object.find('.uifm-edit-panel-right').addClass('uifm-panel-tog-right-closed');

			$('#uifm-panel-arrow-right').find('.uifm-arrow-open').css('display', 'none');
			$('#uifm-panel-arrow-right').find('.uifm-arrow-closed').css('display', 'block');
			$('.uiform-editing-main .uiform-builder-data').hide();
			$('#uifm-panel-arrow-right').addClass('uifm-layout-toggler-close');
			$('#uifm-panel-arrow-right').attr('title', 'Open');
		} else {
			$('#uifm-panel-arrow-right').removeClass('uifm-layout-toggler-close');
			uipanel_object.find('.uifm-edit-panel-right').removeClass('uifm-panel-tog-right-closed');
			var innerwidthRight = uifm_panelright_width;
			newWidthPanelRight = ((parseFloat(innerwidthRight) * 100) / parseFloat(uifm_width_panel)).toFixed(3);
			bothWidthPanel = parseFloat(uifm_width_panel_right) + parseFloat(uifm_width_panel_center);
			newWidthPanelCenter = parseFloat(bothWidthPanel) - parseFloat(newWidthPanelRight);
			uipanel_object.find('.uifm-edit-panel-right').css('width', newWidthPanelRight + '%');
			uipanel_object.find('.uifm-edit-panel-center').css('width', newWidthPanelCenter + '%');

			$('#uifm-panel-arrow-right').find('.uifm-arrow-open').css('display', 'block');
			$('#uifm-panel-arrow-right').find('.uifm-arrow-closed').css('display', 'none');
			$('.uiform-editing-main .uiform-builder-data').show();
			$('#uifm-panel-arrow-right').addClass('uifm-layout-toggler-open');
			$('#uifm-panel-arrow-right').attr('title', 'Close');
		}
		$(window).trigger('resize');
	};
	$.fn.extend({
		ColumnToggle: function (options) {
			var defaults = {
				draggingClass: '',
				onResize: null
			};
			var node = this;
			var options = $.extend(defaults, options);
			return this.each(function () {
				function resize_panel() {
					onPanelResize();
				}
				$(window).resize(function () {
					resize_panel();
				});
				$('#uifm-panel-arrow-left').click(function () {
					onTogglerLeftPanel();
				});
				$('#uifm-panel-arrow-right').click(function () {
					onTogglerRightPanel();
				});
				init(this, options);
			});
		}
	});
})($uifm);

if (typeof $uifm === 'undefined') {
	$uifm = jQuery;
}

var uifmsetting;
(function ($, window) {
	window.uifmsetting = uifmsetting =
		$.uifmsetting ||
		function () {
			function initialize() {}

			arguments.callee.redirect = function (redirect) {
				if (window.event) {
					window.event.returnValue = false;
					window.location = redirect;
				} else {
					location.href = redirect;
				}
			};

			arguments.callee.settings_saveFormSettings = function () {
				$('#frmform').validate({
					errorClass: 'help-inline',
					errorElement: 'span',
					rules: {
						site_title: {
							required: true
						},
						admin_mail: {
							required: true,
							email: true
						}
					},
					messages: {
						site_title: {
							required: 'Please specify site title'
						},
						admin_mail: {
							required: 'We need email address'
						}
					},
					highlight: function (label) {
						$(label).closest('.control-group').addClass('error').removeClass('success');
					},
					success: function (label) {
						$(label).text('').closest('.control-group').addClass('success');
					},
					submitHandler: function (form) {
						form.submit(); 
					}
				});
				$('#frmform').submit();
			};

			arguments.callee.user_SaveUser = function () {
				$('#frmform').validate({
					errorClass: 'help-inline',
					errorElement: 'span',
					rules: {
						use_login: {
							required: true
						},
						use_password: {
							required: true,
							minlength: 5
						},
						use_password2: {
							required: true,
							equalTo: '#use_password',
							minlength: 5
						}
					},
					messages: {
						nameform: {
							required: 'Please specify your username'
						},
						descriptionform: {
							required: 'We need your email address'
						}
					},
					highlight: function (label) {
						$(label).closest('.control-group').addClass('error').removeClass('success');
					},
					success: function (label) {
						$(label).text('').closest('.control-group').addClass('success');
					},
					submitHandler: function (form) {
						form.submit(); 
					}
				});

				$('#frmform').submit();
			};

			arguments.callee.user_CancelUser = function () {
				this.redirect(uiform_vars.url_admin + 'user/intranet/index');
			};
		};
	uifmsetting();
})($uifm, window);

(function ($) {
	var uiformAppetext = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 29,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'appetext',
				input: {
					value: '',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					placeholder: '',
					color: '#000',
					font: '',
					font_st: 1,
					val_align: '',
					append_txt: encodeURIComponent('@')
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				el_background: {
					show_st: '1',
					type: '1',
					start_color: '',
					end_color: '',
					solid_color: '#ffffff'
				},
				el_border_radius: {
					show_st: '1',
					size: '0'
				},
				el_border: {
					show_st: '1',
					color: '#ccc',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '1'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					customval_regex: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-password').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};

		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input-valign',
					'.uifm-set-section-input-placeh',
					'.uifm-set-section-inputtextbox',
					'.uifm-set-section-inputboxbg',
					'.uifm-set-section-inputboxborder',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'.zgfm-set-section-custominput-box',
					'#uifm-custom-val-req-btn',
					'#uifm-custom-val-alpha-btn',
					'#uifm-custom-val-alphanum-btn',
					'#uifm-custom-val-num-btn',
					'#uifm-custom-val-mail-btn',
					'.uifm-set-section-inputappend',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-input1-txtvalue',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_appetext = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_appetext')) return;

			var myplugin = new uiformAppetext(this, options);

			element.data('uiform_appetext', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformCaptcha = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 19,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'captcha',
				input6: {
					txt_color_st: '0',
					txt_color: '1000',
					background_st: '0',
					background_color: '',
					distortion: '1',
					behind_lines_st: '0',
					behind_lines: '2',
					front_lines_st: '0',
					front_lines: '2'
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-captcha').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',

					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input6',
					'.uifm-set-section-helpblock',

					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-input4-defaultvalue',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-input1-txtvalue',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};
		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_captcha = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_captcha')) return;

			var myplugin = new uiformCaptcha(this, options);

			element.data('uiform_captcha', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformCheckbox = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 9,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'checkbox',
				input2: {
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '',
					font_st: 1,
					block_align: 0,
					style_type: 1,
					options: {},
					stl1: {
						border_color: '#337ab7',
						bg_color: '#ffffff',
						icon_color: '#337ab7',
						icon_mark: 'fa-check',
						size: '14'
					}
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-checkbox').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);

				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input2',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {
			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		this.input2settings_preview_genAllOptions = function () {

			var f_id = settings['data']['id'];
			var obj = $('#' + f_id);
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			var f_block_align = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'block_align');
			var f_type = rocketform.getUiData4('steps_src', f_step, f_id, 'type');
			var values = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'options');
			var stl1_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type');

			var input2_check = rocketform.getUiData4('steps_src', f_step, f_id, 'input2');

			var valhash = CryptoJS.MD5(JSON.stringify(input2_check));
			var f_checkhash = $('#' + f_id).attr('data-zgfm-input2-hash');

			if (String(f_checkhash) === String(valhash)) {
			} else {
				$('#' + f_id).attr('data-zgfm-input2-hash', valhash);

				var newoptprev;
				obj.find('.uifm-input2-wrap').html('');

				switch (parseInt(f_type)) {
					case 8:

						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp2_templates').find('.sfdc-radio').clone();
							newoptprev.attr('data-inp2-opt-index', index);
							newoptprev.find('.uifm-inp2-rdo').prop('checked', parseInt(value['checked']));
							newoptprev.find('.uifm-inp2-rdo').attr('name', 'uifm_' + f_id + '_opt');
							newoptprev.find('.uifm-inp2-label').html(value['label']);

							obj.find('.uifm-input2-wrap').append(newoptprev.prop('outerHTML'));
						});

						if (parseInt(f_block_align) === 1) {
							obj.find('.uifm-input2-wrap .sfdc-radio').attr('class', 'sfdc-radio-inline');
						} else {
							obj.find('.uifm-input2-wrap .sfdc-radio-inline').attr('class', 'sfdc-radio');
						}
						break;
					case 9:
						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp2_templates').find('.sfdc-checkbox').clone();
							newoptprev.attr('data-inp2-opt-index', index);
							newoptprev.find('.uifm-inp2-chk').prop('checked', parseInt(value['checked']));
							newoptprev.find('.uifm-inp2-chk').attr('name', 'uifm_' + f_id + '_opt');
							newoptprev.find('.uifm-inp2-label').html(value['label']);
							obj.find('.uifm-input2-wrap').append(newoptprev);
						});

						if (parseInt(f_block_align) === 1) {
							obj.find('.uifm-input2-wrap .sfdc-checkbox').attr('class', 'sfdc-checkbox-inline');
						} else {
							obj.find('.uifm-input2-wrap .sfdc-checkbox-inline').attr('class', 'sfdc-checkbox');
						}


						$('#' + f_id).attr('data-zgfm-stl1-hash', '');

						if (parseInt(stl1_st) === 1) {
							this.previewfield_input2_stl1();
						}

						break;
					case 10:
						obj.find('.uifm-input2-wrap').append('<select class="sfdc-form-control uifm-input2-opt-main" ></select>');
						$.each(values, function (index, value) {
							newoptprev = '<option data-inp2-opt-index="' + index + '" ';

							if (parseInt(value['checked']) === 1) {
								newoptprev += ' selected ';
							}
							newoptprev += ' > ' + value['label'] + ' </option>';
							obj.find('.uifm-input2-wrap select').append(newoptprev);
						});
						break;
					case 11:
						obj.find('.uifm-input2-wrap').append('<select class="sfdc-form-control uifm-input2-opt-main" multiple ></select>');
						$.each(values, function (index, value) {
							newoptprev = '<option data-inp2-opt-index="' + index + '" ';

							if (parseInt(value['checked']) === 1) {
								newoptprev += ' selected ';
							}
							newoptprev += ' > ' + value['label'] + ' </option>';
							obj.find('.uifm-input2-wrap select').append(newoptprev);
						});
						break;
				}

				var f_size = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'size'),
					f_bold = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'bold'),
					f_italic = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'italic'),
					f_underline = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'underline'),
					f_color = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'color');

				if (f_size) {
					obj.find('.uifm-input2-opt-main').css('font-size', f_size + 'px');
				}

				if (parseInt(f_bold) === 1) {
					obj.find('.uifm-input2-opt-main').css('font-weight', 'bold');
				} else {
					obj.find('.uifm-input2-opt-main').css('font-weight', 'normal');
				}

				if (parseInt(f_italic) === 1) {
					obj.find('.uifm-input2-opt-main').css('font-style', 'italic');
				} else {
					obj.find('.uifm-input2-opt-main').removeCss('font-style');
				}

				if (parseInt(f_underline) === 1) {
					obj.find('.uifm-input2-opt-main').css('text-decoration', 'underline');
				} else {
					obj.find('.uifm-input2-opt-main').removeCss('text-decoration');
				}

				obj.find('.uifm-input2-opt-main').removeCss('color');
				if (f_color) {
					obj.find('.uifm-input2-opt-main').css('color', f_color);
				}

				rocketform.previewfield_fontfamily(obj, 'input2', '.uifm-input2-opt-main');
			}
		};

		this.input2settings_statusRdoOption = function (el) {
			var f_id = settings['data']['id'];

			var opt_index = el.closest('.uifm-fld-inp2-options-row').data('opt-index');
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');
			var f_type = rocketform.getUiData4('steps_src', f_step, f_id, 'type');
			var opt_value;

			var stl1_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type');

			var options = rocketform.getUiData5('steps_src', parseInt(f_step), f_id, 'input2', 'options');

			switch (parseInt(f_type)) {
				case 8:
				case 10:
					if (options) {
						$.each(options, function (index2, value2) {
							rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', index2, 'checked', 0);
						});
					}
					break;
				case 9:
				case 11:
					var el_checked = el.is(':checked') ? 1 : 0;
					var el_box_index = el.closest('.uifm-fld-inp2-options-row');
					rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', el_box_index, 'checked', el_checked);

					break;
			}

			switch (parseInt(f_type)) {
				case 8:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_rdo').prop('checked') ? 1 : 0;
					break;
				case 9:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_chk').prop('checked') ? 1 : 0;
					break;
				case 10:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_rdo').prop('checked') ? 1 : 0;
					break;
				case 11:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_chk').prop('checked') ? 1 : 0;
					break;
			}

			rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', opt_index, 'checked', opt_value);
			var prev_el_sel = $('#' + f_id)
				.find('.uifm-input2-wrap ')
				.find("[data-inp2-opt-index='" + opt_index + "']");

			switch (parseInt(f_type)) {
				case 8:
				case 9:
					prev_el_sel.find('input').prop('checked', opt_value);

					if (parseInt(stl1_st) === 1) {
						if (opt_value === 1) {
							prev_el_sel.find('input').data('checkradios').form.checkboxEnable(prev_el_sel.find('input'));
						} else {
							prev_el_sel.find('input').data('checkradios').form.checkboxDisable(prev_el_sel.find('input'));
						}
					}

					break;
				case 10:
					prev_el_sel.prop('selected', opt_value);
					break;
				case 11:
					prev_el_sel.prop('selected', opt_value);
					break;
			}
		};

		this.previewfield_input2_stl1 = function () {
			var f_id = settings['data']['id'];
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			var stl_type = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type'),
				stl1_border_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color'),
				stl1_bg_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg_color'),
				stl1_icon_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color'),
				stl1_icon_mark = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_mark'),
				stl1_size = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'size');

			var f_values = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'stl1');
			$.extend(f_values, { style_type: stl_type });

			var valhash = CryptoJS.MD5(JSON.stringify(f_values));

			var f_checkhash = $('#' + f_id).attr('data-zgfm-stl1-hash');

			if (String(f_checkhash) === String(valhash)) {
			} else {
				$('#' + f_id).attr('data-zgfm-stl1-hash', valhash);
				$('#' + f_id)
					.find('.uifm-input2-wrap input')
					.unbind()
					.removeData();

				var tmp_inp, tmp_wrap;
				$.each($('#' + f_id).find('.uifm-input2-wrap .sfdc-checkbox'), function (index, value) {
					tmp_inp = $(this).find('.checkradios-checkbox input');
					tmp_wrap = $(this).find('.checkradios-checkbox');
					tmp_wrap.replaceWith(tmp_inp);
				});

				if (parseInt(stl_type) === 1) {

					$('#' + f_id)
						.find('.uifm-input2-wrap input')
						.checkradios({
							checkbox: {
								iconClass: 'fa ' + stl1_icon_mark
							},
							radio: {
								iconClass: 'fa ' + stl1_icon_mark
							}
						});

					var str_css = '';
					$('#' + f_id + '_stl1_css').remove();

					str_css = '<style type="text/css" id="' + f_id + '_stl1_css">';
					str_css += '#' + f_id + ' .checkradios-checkbox, #' + f_id + ' .checkradios-radio {';

					if (stl1_border_color) {
						str_css += 'border:2px solid ' + stl1_border_color + ';';
					}
					if (stl1_bg_color) {
						str_css += 'background: ' + stl1_bg_color + ';';
					}
					if (stl1_icon_color) {
						str_css += 'color: ' + stl1_icon_color + ';';
					}
					if (stl1_size) {
						str_css += 'font-size: ' + stl1_size + 'px;';
					}
					str_css += '} ';
					str_css += '</style>';
					$('head').append(str_css);
				} else {
				}
			}
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_checkbox = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_checkbox')) return;

			var myplugin = new uiformCheckbox(this, options);

			element.data('uiform_checkbox', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformColorpicker = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 23,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'colorpicker',
				input10: {
					value: ''
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-timepicker').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_colorpicker = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_colorpicker')) return;

			var myplugin = new uiformColorpicker(this, options);

			element.data('uiform_colorpicker', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformCustomhtml = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 14,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				type_n: 'customhtml',
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				input3: {
					text: encodeURIComponent('<div style="border: 1px dotted red;"></br>here goes your custom html</br>&nbsp;</div>'),
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '',
					font_st: 1
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-customhtml').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input3',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-input3',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_customhtml = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_customhtml')) return;

			var myplugin = new uiformCustomhtml(this, options);

			element.data('uiform_customhtml', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformDatepicker = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 24,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'datepicker',
				input7: {
					format: '',
					language: ''
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-datepicker').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input7',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-input4-defaultvalue',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_datepicker = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_datepicker')) return;

			var myplugin = new uiformDatepicker(this, options);

			element.data('uiform_datepicker', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uifmFlatPickr = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 43,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'datepicker2',
				input_date2: {
					enabletime: '0',
					nocalendar: '0',
					time_24hr: '0',
					altinput: '0',
					isinline: '0',
					altformat: 'F j, Y',
					dateformat: 'Y-m-d',
					language: 'en',
					mindate: 'today',
					maxdate: '',
					defaultdate: '',
					inline: '0'
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-datepicker2').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'#uifm-fld-inp-date2-box',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		this.inputsettings_refresh_Options = function (option, tab, value) {
			switch (String(option)) {
				case 'enabletime':
					if (parseInt(value) === 1) {
						tab.find('#uifm_fld_inp19_enabletime').bootstrapSwitchZgpb('state', true);
					} else {
						tab.find('#uifm_fld_inp19_enabletime').bootstrapSwitchZgpb('state', false);
					}
					break;
				case 'nocalendar':
					if (parseInt(value) === 1) {
						tab.find('#uifm_fld_inp19_nocalendar').bootstrapSwitchZgpb('state', true);
					} else {
						tab.find('#uifm_fld_inp19_nocalendar').bootstrapSwitchZgpb('state', false);
					}
					break;
				case 'isinline':
					if (parseInt(value) === 1) {
						tab.find('#uifm_fld_inp19_isinline').bootstrapSwitchZgpb('state', true);
					} else {
						tab.find('#uifm_fld_inp19_isinline').bootstrapSwitchZgpb('state', false);
					}
					break;
				case 'time_24hr':
					if (parseInt(value) === 1) {
						tab.find('#uifm_fld_inp19_time24hr').bootstrapSwitchZgpb('state', true);
					} else {
						tab.find('#uifm_fld_inp19_time24hr').bootstrapSwitchZgpb('state', false);
					}
					break;
				case 'altinput':
					if (parseInt(value) === 1) {
						tab.find('#uifm_fld_inp19_altinput').bootstrapSwitchZgpb('state', true);
					} else {
						tab.find('#uifm_fld_inp19_altinput').bootstrapSwitchZgpb('state', false);
					}
					break;
				case 'altformat':
					tab.find('#uifm_fld_inp19_altformat').val(value);
					break;
				case 'dateformat':
					tab.find('#uifm_fld_inp19_dateformat').val(value);
					break;
				case 'language':
					tab.find('#uifm_fld_inp19_language').val(value);
					break;
				case 'mindate':
					tab.find('#uifm_fld_inp19_mindate').val(value);
					break;
				case 'maxdate':
					tab.find('#uifm_fld_inp19_maxdate').val(value);
					break;
				case 'defaultdate':
					tab.find('#uifm_fld_inp19_defaultdate').val(value);
					break;
			}
		};

		this.inputsettings_preview_genAllOptions = function (obj, section) {
			var f_type = obj.data('typefield');
			var f_id = obj.attr('id');
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			var enabletime = rocketform.getUiData5('steps_src', f_step, f_id, section, 'enabletime');
			var nocalendar = rocketform.getUiData5('steps_src', f_step, f_id, section, 'nocalendar');
			var time_24hr = rocketform.getUiData5('steps_src', f_step, f_id, section, 'time_24hr');
			var altinput = rocketform.getUiData5('steps_src', f_step, f_id, section, 'altinput');
			var altformat = rocketform.getUiData5('steps_src', f_step, f_id, section, 'altformat');
			var dateformat = rocketform.getUiData5('steps_src', f_step, f_id, section, 'dateformat');
			var language = rocketform.getUiData5('steps_src', f_step, f_id, section, 'language');
			var mindate = rocketform.getUiData5('steps_src', f_step, f_id, section, 'mindate');
			var maxdate = rocketform.getUiData5('steps_src', f_step, f_id, section, 'maxdate');
			var defaultdate = rocketform.getUiData5('steps_src', f_step, f_id, section, 'defaultdate');
			var inline = rocketform.getUiData5('steps_src', f_step, f_id, section, 'inline');

			var f_values = rocketform.getUiData4('steps_src', f_step, f_id, section);

			var valhash = CryptoJS.MD5(JSON.stringify(f_values));

			var f_checkhash = $('#' + f_id).attr('data-check-hash');

			if (String(f_checkhash) === String(valhash)) {
			} else {
				$('#' + f_id).attr('data-check-hash', valhash);

				var tmp = {};
				tmp['wrap'] = true;
				if (parseInt(enabletime) === 1) {
					tmp['enableTime'] = true;
				} else {
					tmp['enableTime'] = false;
				}

				if (parseInt(nocalendar) === 1) {
					tmp['noCalendar'] = true;
				} else {
					tmp['noCalendar'] = false;
				}

				if (parseInt(time_24hr) === 1) {
					tmp['time_24hr'] = true;
				} else {
					tmp['time_24hr'] = false;
				}

				if (parseInt(altinput) === 1) {
					tmp['altInput'] = true;
				} else {
					tmp['altInput'] = false;
				}

				if (String(altformat).length > 0) {
					tmp['altFormat'] = altformat;
				} else {
					tmp['altFormat'] = 'F j, Y';
				}

				if (String(dateformat).length > 0) {
					tmp['dateFormat'] = dateformat;
				} else {
					tmp['dateFormat'] = 'Y-m-d';
				}

				tmp['locale'] = language;

				if (String(mindate).length > 0) {
					tmp['minDate'] = mindate;
				}

				if (String(maxdate).length > 0) {
					tmp['maxDate'] = maxdate;
				}

				if (String(defaultdate).length > 0) {
					tmp['defaultDate'] = defaultdate;
				}

				flatpickr(obj.find('.uifm-input-flatpickr')[0], tmp);
			}
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uifm_datepickr_flat = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uifm_datepickr_flat')) return;

			var myplugin = new uifmFlatPickr(this, options);

			element.data('uifm_datepickr_flat', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformDatetime = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 26,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'datetime',
				input7: {
					format: '',
					language: ''
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-datetime').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input7',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-input4-defaultvalue',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_datetime = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_datetime')) return;

			var myplugin = new uiformDatetime(this, options);

			element.data('uiform_datetime', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformDivider = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 32,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				type_n: 'divider',
				input11: {
					text_val: 'Type your text here',
					text_color: '#000000',
					div_color: '#CCCCCC',
					div_col_st: '1',
					text_size: '15',
					bold: '0',
					italic: '0',
					underline: '0',
					font: '',
					font_st: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-divider').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-tab-fld-input',
					'.uifm-set-section-input11',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-2"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_divider = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_divider')) return;

			var myplugin = new uiformDivider(this, options);

			element.data('uiform_divider', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformDyncheckbox = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 41,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'dyncheckbox',
				input17: {
					thopt_mode: '1', 
					thopt_height: '100',
					thopt_width: '100',
					thopt_zoom: '1',
					thopt_usethmb: '1',
					thopt_showhvrtxt: '1',
					thopt_showcheckb: '1',
					options: {
						0: {
							label: 'Option 1',
							checked: 0,
							price: 0,
							img_list: {
								0: {
									img_full: '',
									img_th_150x150: '',
									title: 'image 1'
								}
							},
							img_list_2: {},
							qty_st: '0',
							qty_max: '2'
						}
					}
				},
				price: {
					enable_st: '1',
					lbl_show_st: '1',
					lbl_show_format: '%3Cp%3E(%5Buifm_symbol%5D%20%5Buifm_price%5D%20%5Buifm_currency%5D)%3C%2Fp%3E',
					color: '#FF0000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-dyncheckbox').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-input17',
					'.uifm-set-section-pricesetting',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_dyncheckbox = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_dyncheckbox')) return;

			var myplugin = new uiformDyncheckbox(this, options);

			element.data('uiform_dyncheckbox', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformDynradiobtn = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 42,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'dynradiobtn',
				input17: {
					thopt_mode: '1', 
					thopt_height: '100',
					thopt_width: '100',
					thopt_zoom: '1',
					thopt_usethmb: '1',
					thopt_showhvrtxt: '1',
					thopt_showcheckb: '1',
					options: {
						0: {
							label: 'Option 1',
							checked: 0,
							price: 0,
							img_list: {
								0: {
									img_full: '',
									img_th_150x150: '',
									title: 'image 1'
								}
							},
							img_list_2: {},
							qty_st: '0',
							qty_max: '2'
						}
					}
				},
				price: {
					enable_st: '1',
					lbl_show_st: '1',
					lbl_show_format: '%3Cp%3E(%5Buifm_symbol%5D%20%5Buifm_price%5D%20%5Buifm_currency%5D)%3C%2Fp%3E',
					color: '#FF0000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-dynradiobtn').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-input17',
					'.uifm-set-section-pricesetting',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_dynradiobtn = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_dynradiobtn')) return;

			var myplugin = new uiformDynradiobtn(this, options);

			element.data('uiform_dynradiobtn', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformFileupload = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 12,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'fileupload',
				input16: {
					extallowed: 'png,doc,docx,xls,xlsx,csv,txt,rtf,zip,mp3,wma,wmv,mpg,flv,avi,jpg,jpeg,png,gif,ods,rar,ppt,tif,wav,mov,psd,eps,sit,sitx,cdr,ai,mp4,m4a,bmp,pps,aif,pdf',
					maxsize: '1',
					attach_st: '0',
					stl1: {
						txt_selimage: 'Select image',
						txt_change: 'Change',
						txt_remove: 'Remove'
					}
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-fileupload').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'.uifm-set-section-input16',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_fileupload = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_fileupload')) return;

			var myplugin = new uiformFileupload(this, options);

			element.data('uiform_fileupload', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiform_gridsystem = function (element, options) {
		var elem = $(element);
		var obj = this;
		var defaults = {
			data: {
				type: 4,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				type_n: 'column4'
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};
		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
			}

			rocketform.checkScrollTab();
		};

		this.enableSettingOptions = function (id_element) {
			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(id_element)) {
				rocketform.setDataToSettingTabAndPreview(id_element, settings.data);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};
		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};

		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};

		this.setDataToCoreStore = function (step_pane, id) {
			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};
	};

	$.fn.uiform_gridsystem = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_gridsystem')) return;

			var myplugin = new uiform_gridsystem(this, options);

			element.data('uiform_gridsystem', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiform_heading = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 0,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				type_n: '',
				input: {
					value: 'Type your heading here',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000000',
					font: '',
					font_st: 1,
					val_align: '',
					obj_align: ''
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '0',
					block_align: '0',
					grid_layout: '2'
				},
				el_background: {
					show_st: '0',
					type: '1',
					start_color: '#55acf8',
					end_color: '#2d6ca2',
					solid_color: '#ffffff'
				},
				el_border_radius: {
					show_st: '0',
					size: '17'
				},
				el_border: {
					show_st: '0',
					color: '#000',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '0'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};
		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-inputtextbox',
					'.uifm-set-section-inputboxbg',
					'.uifm-set-section-inputboxborder',
					'.uifm-set-section-input-objalign',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-input1-txtvalue',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-2"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};

		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setToDatalvl2 = function (option, option2, value) {
			settings.data[option][option2] = value;
		};
		this.setDataToCoreStore = function (step_pane, id) {
			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};
	};

	$.fn.uiform_heading = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_heading')) return;

			var myplugin = new uiform_heading(this, options);

			element.data('uiform_heading', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformHiddeninput = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 21,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				type_n: 'hiddeninput',
				input8: {
					value: 'Hidden text'
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-hiddeninput').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-input',
					'.uifm-set-section-input8',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-2"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_hiddeninput = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_hiddeninput')) return;

			var myplugin = new uiformHiddeninput(this, options);

			element.data('uiform_hiddeninput', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformImageupload = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 13,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'imageupload',
				input16: {
					extallowed: 'png,jpg,jpeg,png,gif,bmp,tif',
					maxsize: '1',
					attach_st: '0',
					stl1: {
						txt_selimage: 'Select image',
						txt_change: 'Change',
						txt_remove: 'Remove'
					}
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-imageupload').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-logicrls',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'.uifm-set-section-input16',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_imageupload = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_imageupload')) return;

			var myplugin = new uiformImageupload(this, options);

			element.data('uiform_imageupload', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformMultiselect = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 11,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'multiselect',
				input2: {
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '',
					font_st: 1,
					style_type: 1,
					options: {},
					stl1: {
						border_color: '#ccc',
						bg1_color1: '#fff',
						bg1_color2: '#e0e0e0',
						bg2_color1_h: '#e0e0e0',
						bg2_color2_h: '#e0e0e0',
						icon_color: '#000',
						search_st: '0',
						txt_noselected: 'Nothing selected',
						txt_noresult: 'No results match',
						txt_countsel: '{0} of {1} selected'
					}
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-multiselect').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input2',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		this.input2settings_preview_genAllOptions = function () {

			var f_id = settings['data']['id'];
			var obj = $('#' + f_id);
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			var f_block_align = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'block_align');
			var f_type = rocketform.getUiData4('steps_src', f_step, f_id, 'type');
			var values = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'options');
			var stl1_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type');

			var input2_check = rocketform.getUiData4('steps_src', f_step, f_id, 'input2');

			var valhash = CryptoJS.MD5(JSON.stringify(input2_check));
			var f_checkhash = $('#' + f_id).attr('data-zgfm-input2-hash');

			if (String(f_checkhash) === String(valhash)) {
			} else {
				$('#' + f_id).attr('data-zgfm-input2-hash', valhash);

				var newoptprev;
				obj.find('.uifm-input2-wrap').html('');

				switch (parseInt(f_type)) {
					case 8:

						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp2_templates').find('.sfdc-radio').clone();
							newoptprev.attr('data-inp2-opt-index', index);
							newoptprev.find('.uifm-inp2-rdo').prop('checked', parseInt(value['checked']));
							newoptprev.find('.uifm-inp2-rdo').attr('name', 'uifm_' + f_id + '_opt');
							newoptprev.find('.uifm-inp2-label').html(value['label']);

							obj.find('.uifm-input2-wrap').append(newoptprev.prop('outerHTML'));
						});

						if (parseInt(f_block_align) === 1) {
							obj.find('.uifm-input2-wrap .sfdc-radio').attr('class', 'sfdc-radio-inline');
						} else {
							obj.find('.uifm-input2-wrap .sfdc-radio-inline').attr('class', 'sfdc-radio');
						}
						break;
					case 9:
						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp2_templates').find('.sfdc-checkbox').clone();
							newoptprev.attr('data-inp2-opt-index', index);
							newoptprev.find('.uifm-inp2-chk').prop('checked', parseInt(value['checked']));
							newoptprev.find('.uifm-inp2-chk').attr('name', 'uifm_' + f_id + '_opt');
							newoptprev.find('.uifm-inp2-label').html(value['label']);
							obj.find('.uifm-input2-wrap').append(newoptprev);
						});

						if (parseInt(f_block_align) === 1) {
							obj.find('.uifm-input2-wrap .sfdc-checkbox').attr('class', 'sfdc-checkbox-inline');
						} else {
							obj.find('.uifm-input2-wrap .sfdc-checkbox-inline').attr('class', 'sfdc-checkbox');
						}

						$('#' + f_id).attr('data-zgfm-stl1-hash', '');
						if (parseInt(stl1_st) === 1) {
							this.previewfield_input2_stl1();
						}

						break;
					case 10:
						obj.find('.uifm-input2-wrap').append('<select class="sfdc-form-control uifm-input2-opt-main" ></select>');
						$.each(values, function (index, value) {
							newoptprev = '<option data-inp2-opt-index="' + index + '" ';

							if (parseInt(value['checked']) === 1) {
								newoptprev += ' selected ';
							}
							newoptprev += ' > ' + value['label'] + ' </option>';
							obj.find('.uifm-input2-wrap select').append(newoptprev);
						});

						$('#' + f_id).attr('data-zgfm-stl1-hash', '');
						if (parseInt(stl1_st) === 1) {
							this.previewfield_input2_stl1();
						}
						break;
					case 11:
						obj.find('.uifm-input2-wrap').append('<select class="sfdc-form-control uifm-input2-opt-main" multiple ></select>');
						$.each(values, function (index, value) {
							newoptprev = '<option data-inp2-opt-index="' + index + '" ';

							if (parseInt(value['checked']) === 1) {
								newoptprev += ' selected ';
							}
							newoptprev += ' > ' + value['label'] + ' </option>';
							obj.find('.uifm-input2-wrap select').append(newoptprev);
						});
						$('#' + f_id).attr('data-zgfm-stl1-hash', '');
						if (parseInt(stl1_st) === 1) {
							this.previewfield_input2_stl1();
						}
						break;
				}

				if (parseInt(stl1_st) != 1) {
					var f_size = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'size'),
						f_bold = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'bold'),
						f_italic = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'italic'),
						f_underline = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'underline'),
						f_color = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'color');

					if (f_size) {
						obj.find('.uifm-input2-opt-main').css('font-size', f_size + 'px');
					}

					if (parseInt(f_bold) === 1) {
						obj.find('.uifm-input2-opt-main').css('font-weight', 'bold');
					} else {
						obj.find('.uifm-input2-opt-main').css('font-weight', 'normal');
					}

					if (parseInt(f_italic) === 1) {
						obj.find('.uifm-input2-opt-main').css('font-style', 'italic');
					} else {
						obj.find('.uifm-input2-opt-main').removeCss('font-style');
					}

					if (parseInt(f_underline) === 1) {
						obj.find('.uifm-input2-opt-main').css('text-decoration', 'underline');
					} else {
						obj.find('.uifm-input2-opt-main').removeCss('text-decoration');
					}

					obj.find('.uifm-input2-opt-main').removeCss('color');
					if (f_color) {
						obj.find('.uifm-input2-opt-main').css('color', f_color);
					}

					rocketform.previewfield_fontfamily(obj, 'input2', '.uifm-input2-opt-main');
				}
			}
		};

		this.input2settings_statusRdoOption = function (el) {
			var f_id = settings['data']['id'];

			var opt_index = el.closest('.uifm-fld-inp2-options-row').data('opt-index');
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');
			var f_type = rocketform.getUiData4('steps_src', f_step, f_id, 'type');
			var opt_value;

			var stl1_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type');

			var options = rocketform.getUiData5('steps_src', parseInt(f_step), f_id, 'input2', 'options');

			switch (parseInt(f_type)) {
				case 8:
				case 10:
					if (options) {
						$.each(options, function (index2, value2) {
							rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', index2, 'checked', 0);
						});
					}
					break;
				case 9:
				case 11:
					var el_checked = el.is(':checked') ? 1 : 0;
					var el_box_index = el.closest('.uifm-fld-inp2-options-row');
					rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', el_box_index, 'checked', el_checked);

					break;
			}

			switch (parseInt(f_type)) {
				case 8:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_rdo').prop('checked') ? 1 : 0;
					break;
				case 9:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_chk').prop('checked') ? 1 : 0;
					break;
				case 10:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_rdo').prop('checked') ? 1 : 0;
					break;
				case 11:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_chk').prop('checked') ? 1 : 0;
					break;
			}

			rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', opt_index, 'checked', opt_value);
			var prev_el_sel = $('#' + f_id)
				.find('.uifm-input2-wrap ')
				.find("[data-inp2-opt-index='" + opt_index + "']");

			switch (parseInt(f_type)) {
				case 8:
				case 9:
					prev_el_sel.find('input').prop('checked', opt_value);

					if (parseInt(stl1_st) === 1) {
						if (opt_value === 1) {
							prev_el_sel.find('input').data('checkradios').form.checkboxEnable(prev_el_sel.find('input'));
						} else {
							prev_el_sel.find('input').data('checkradios').form.checkboxDisable(prev_el_sel.find('input'));
						}
					}

					break;
				case 10:

					break;
				case 11:
					if (parseInt(stl1_st) === 0) {
						prev_el_sel.prop('selected', opt_value);
					} else if (parseInt(stl1_st) === 1) {
						var tmp_sel_val = rocketform.getUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', opt_index, 'value');
						$('#' + f_id)
							.find('.uifm-input2-wrap ')
							.find('select')
							.selectpicker('val', tmp_sel_val);
					}
					break;
			}
		};

		this.previewfield_input2_stl1 = function () {
			var f_id = settings['data']['id'];
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			var stl_type = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type'),
				stl1_border_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color'),
				stl1_bg1_color1 = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1'),
				stl1_bg1_color2 = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2'),
				stl1_bg2_color1_h = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h'),
				stl1_bg2_color2_h = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h'),
				stl1_search_st = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'search_st'),
				inp_size = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'size'),
				inp_bold = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'bold'),
				inp_italic = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'italic'),
				inp_underline = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'underline'),
				inp_font = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'font'),
				inp_font_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'font_st'),
				inp_color = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'color'),
				stl1_icon_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color');

			var f_values = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'stl1');
			$.extend(f_values, { style_type: stl_type });

			var valhash = CryptoJS.MD5(JSON.stringify(f_values));

			var f_checkhash = $('#' + f_id).attr('data-zgfm-stl1-hash');

			if (String(f_checkhash) === String(valhash)) {
			} else {
				$('#' + f_id).attr('data-zgfm-stl1-hash', valhash);

				if (parseInt(stl_type) === 1) {

					if (
						$('#' + f_id)
							.find('.uifm-input2-wrap select')
							.data('selectpicker')
					) {

						if (parseInt(stl1_search_st) === 1) {
							$('#' + f_id)
								.find('.uifm-input2-wrap select')
								.attr('data-live-search', true);
						} else {
							$('#' + f_id)
								.find('.uifm-input2-wrap select')
								.attr('data-live-search', false);
						}

						$('#' + f_id)
							.find('.uifm-input2-wrap select')
							.selectpicker('refresh');
					} else {
						if (parseInt(stl1_search_st) === 1) {
							$('#' + f_id)
								.find('.uifm-input2-wrap select')
								.attr('class', 'selectpicker')
								.attr('data-live-search', 'true')
								.selectpicker();
						} else {
							$('#' + f_id)
								.find('.uifm-input2-wrap select')
								.attr('class', 'selectpicker')
								.attr('data-live-search', 'false')
								.selectpicker();
						}
					}


					var str_css = '';
					$('#' + f_id + '_stl1_css').remove();

					str_css = '<style type="text/css" id="' + f_id + '_stl1_css">';
					str_css += '#' + f_id + ' .uifm-input2-wrap button.sfdc-btn {';
					if (stl1_bg1_color1 && stl1_bg1_color2) {
						str_css += 'background-image: linear-gradient(to bottom, ' + stl1_bg1_color1 + ' 0%, ' + stl1_bg1_color2 + ' 100%)!important;';
					}

					if (stl1_border_color) {
						str_css += 'border-color:' + stl1_border_color + '!important;';
					}
					str_css += '} ';
					str_css += '#' + f_id + ' .uifm-input2-wrap button.sfdc-btn:hover, #' + f_id + ' .uifm-input2-wrap button.sfdc-btn:focus {';
					if (stl1_bg2_color1_h && stl1_bg2_color2_h) {
						str_css += 'background-image: linear-gradient(to bottom, ' + stl1_bg2_color1_h + ' 0%, ' + stl1_bg2_color2_h + ' 100%)!important;';
						str_css += 'background-position:0 0!important;';
					}

					if (stl1_border_color) {
						str_css += 'border-color:' + stl1_border_color + '!important;';
					}
					str_css += '} ';
					str_css += '#' + f_id + ' .uifm-input2-wrap .sfdc-bs-caret {';

					if (stl1_icon_color) {
						str_css += 'color:' + stl1_icon_color + '!important;';
					}
					str_css += '} ';

					str_css += '#' + f_id + ' .uifm-input2-wrap .filter-option {';

					if (inp_color) {
						str_css += 'color:' + inp_color + '!important;';
						str_css += 'text-shadow:0 1px 0 ' + inp_color + '!important;';
					}

					if (parseInt(inp_bold) === 1) {
						str_css += 'font-weight:bold;';
					} else {
						str_css += 'font-weight:normal;';
					}

					if (parseInt(inp_italic) === 1) {
						str_css += 'font-style:italic;';
					}

					if (parseInt(inp_underline) === 1) {
						str_css += 'text-decoration:underline;';
					}

					if (inp_size) {
						str_css += 'font-size:' + inp_size + ';';
					}

					str_css += '} ';

					str_css += '#' + f_id + ' .uifm-input2-wrap .filter-option,';
					str_css += '#' + f_id + ' .bootstrap-select.sfdc-btn-group .sfdc-dropdown-menu li a span.text {';

					if (parseInt(inp_font_st) === 1 && inp_font) {
						var font_sel = JSON.parse(inp_font);
						str_css += 'font-family:' + font_sel.family + ';';
					}

					str_css += '</style>';
					$('head').append(str_css);

					rocketform.previewfield_fontfamily2($('#' + f_id), 'input2');
				} else {
					if (
						$('#' + f_id)
							.find('.uifm-input2-wrap select')
							.data('selectpicker')
					) {
						$('#' + f_id)
							.find('.uifm-input2-wrap select')
							.selectpicker('destroy');
					}
					$('#' + f_id)
						.find('.uifm-input2-wrap select')
						.attr('class', 'sfdc-form-control uifm-input2-opt-main')
						.removeAttr('data-live-search');
				}
			}
		};

		this.input2settings_stl1_quickcolor = function (option) {
			var f_id = settings['data']['id'];
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			switch (parseInt(option)) {
				case 1:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#ccc');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#fff');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#e0e0e0');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#e0e0e0');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#e0e0e0');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#000');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#000');

					break;
				case 2:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#245580');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#337ab7');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#265a88');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#265a88');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#265a88');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				case 3:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#3e8f3e');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#5cb85c');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#419641');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#419641');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#419641');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				case 4:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#28a4c9');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#5bc0de');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#2aabd2');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#2aabd2');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#2aabd2');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				case 5:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#e38d13');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#f0ad4e');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#eb9316');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#eb9316');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#eb9316');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				case 6:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#b92c28');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#d9534f');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#c12e2a');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#c12e2a');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#c12e2a');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				default:
					break;
			}

			var tabobject = $('#uifm-field-selected-id').parent();

			var data_field = settings['data']['input2'];
			var f_id = settings['data']['id'];
			var obj_field = $('#' + f_id);
			var f_store_a;

			$.each(data_field, function (index, value) {
				if ($.isPlainObject(value)) {
					$.each(value, function (index2, value2) {
						if ($.isPlainObject(value2)) {
							$.each(value2, function (index3, value3) {
								if ($.isPlainObject(value3)) {
									$.each(value3, function (index4, value4) {
										f_store_a = [];
										f_store_a.push('input2');
										f_store_a.push(index);
										f_store_a.push(index2);
										f_store_a.push(index3);
										f_store_a.push(index4);

										rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value4);
										rocketform.setDataOptToPrevField(obj_field, f_store_a.join('-'), value4);
									});
								} else {
									f_store_a = [];
									f_store_a.push('input2');
									f_store_a.push(index);
									f_store_a.push(index2);
									f_store_a.push(index3);

									rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value3);
									rocketform.setDataOptToPrevField(obj_field, f_store_a.join('-'), value3);
								}
							});
						} else {
							f_store_a = [];
							f_store_a.push('input2');
							f_store_a.push(index);
							f_store_a.push(index2);

							rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value2);
							rocketform.setDataOptToPrevField(obj_field, f_store_a.join('-'), value2);
						}
					});
				} else {
				}
			});
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_multiselect = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_multiselect')) return;

			var myplugin = new uiformMultiselect(this, options);

			element.data('uiform_multiselect', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformPanelfld = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 31,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				type_n: 'panel',
				input18: {
					text: {
						show_st: '1',
						html_cont:
							'%3Cdiv%20class%3D%22uiform-frm-fld31-txthtml-circle%22%3E1%3C%2Fdiv%3E%0A%3Ch3%20class%3D%22uifm-glb-color-red%22%3EHere%20your%20title%3C%2Fh3%3E%0A%3Cp%3EHere%20description%20of%20this%20section%3A%3C%2Fp%3E',
						html_pos: '1'
					},
					pane_margin: {
						show_st: '0',
						pos_top: '10',
						pos_right: '10',
						pos_bottom: '10',
						pos_left: '10'
					},
					pane_padding: {
						show_st: '1',
						pos_top: '5',
						pos_right: '5',
						pos_bottom: '5',
						pos_left: '5'
					},
					pane_background: {
						show_st: '1',
						type: '1',
						start_color: '#cccccc',
						end_color: '#ffffff',
						solid_color: '#cccccc',
						image: ''
					},
					pane_border_radius: {
						show_st: '1',
						size: '5'
					},
					pane_border: {
						show_st: '0',
						color: '#000',
						style: '1',
						width: '1'
					},
					pane_shadow: {
						show_st: '1',
						color: '#CCCCCC',
						h_shadow: '3',
						v_shadow: '3',
						blur: '10'
					}
				},

				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-panelfld').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options');
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options').length) > 0) {
				$(this).find('.zgpb-fields-quick-options').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-tab-fld-input',
					'.uifm-set-section-input18',
					'.uifm-tab-fld-logicrls',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-2') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-2"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_panelfld = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_panelfld')) return;

			var myplugin = new uiformPanelfld(this, options);

			element.data('uiform_panelfld', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformPassword = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 15,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'password',
				input: {
					value: '',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					placeholder: '',
					color: '#000',
					font: '',
					font_st: 1,
					val_align: ''
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				el_background: {
					show_st: '1',
					type: '1',
					start_color: '',
					end_color: '',
					solid_color: '#ffffff'
				},
				el_border_radius: {
					show_st: '1',
					size: '0'
				},
				el_border: {
					show_st: '1',
					color: '#000',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '0'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					customval_regex: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-password').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-inputboxbg',
					'.uifm-set-section-inputboxborder',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'.zgfm-set-section-custominput-box',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_password = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_password')) return;

			var myplugin = new uiformPassword(this, options);

			element.data('uiform_password', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformPrepapptext = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 30,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'prepapptext',
				input: {
					value: '',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					placeholder: '',
					color: '#000',
					font: '',
					font_st: 1,
					val_align: '',
					append_txt: encodeURIComponent('@'),
					prepe_txt: encodeURIComponent('@')
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				el_background: {
					show_st: '1',
					type: '1',
					start_color: '',
					end_color: '',
					solid_color: '#ffffff'
				},
				el_border_radius: {
					show_st: '1',
					size: '0'
				},
				el_border: {
					show_st: '1',
					color: '#ccc',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '1'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					customval_regex: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-password').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input-valign',
					'.uifm-set-section-input-placeh',
					'.uifm-set-section-inputtextbox',
					'.uifm-set-section-inputboxbg',
					'.uifm-set-section-inputboxborder',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'.zgfm-set-section-custominput-box',
					'#uifm-custom-val-req-btn',
					'#uifm-custom-val-alpha-btn',
					'#uifm-custom-val-alphanum-btn',
					'#uifm-custom-val-num-btn',
					'#uifm-custom-val-mail-btn',
					'.uifm-set-section-inputprepend',
					'.uifm-set-section-inputappend',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-input1-txtvalue',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_prepapptext = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_prepapptext')) return;

			var myplugin = new uiformPrepapptext(this, options);

			element.data('uiform_prepapptext', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformPreptext = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 28,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'preptext',
				input: {
					value: '',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					placeholder: '',
					color: '#000',
					font: '',
					font_st: 1,
					val_align: '',
					prepe_txt: encodeURIComponent('@')
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				el_background: {
					show_st: '1',
					type: '1',
					start_color: '',
					end_color: '',
					solid_color: '#ffffff'
				},
				el_border_radius: {
					show_st: '1',
					size: '0'
				},
				el_border: {
					show_st: '1',
					color: '#ccc',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '1'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					customval_regex: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-password').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-inputtextbox',
					'.uifm-set-section-input-valign',
					'.uifm-set-section-input-placeh',
					'.uifm-set-section-inputboxbg',
					'.uifm-set-section-inputboxborder',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'.zgfm-set-section-custominput-box',
					'#uifm-custom-val-req-btn',
					'#uifm-custom-val-alpha-btn',
					'#uifm-custom-val-alphanum-btn',
					'#uifm-custom-val-num-btn',
					'#uifm-custom-val-mail-btn',
					'.uifm-set-section-inputprepend',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-input1-txtvalue',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_preptext = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_preptext')) return;

			var myplugin = new uiformPreptext(this, options);

			element.data('uiform_preptext', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformRadiobtn = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 8,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'radiobutton',
				input2: {
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '',
					font_st: 1,
					block_align: 0,
					style_type: 1,
					options: {},
					stl1: {
						border_color: '#337ab7',
						bg_color: '#ffffff',
						icon_color: '#337ab7',
						icon_mark: 'fa-check',
						size: '14'
					}
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-radiobtn').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);

				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input2',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		this.input2settings_preview_genAllOptions = function () {

			var f_id = settings['data']['id'];
			var obj = $('#' + f_id);
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			var f_block_align = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'block_align');
			var f_type = rocketform.getUiData4('steps_src', f_step, f_id, 'type');
			var values = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'options');
			var stl1_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type');

			var input2_check = rocketform.getUiData4('steps_src', f_step, f_id, 'input2');

			var valhash = CryptoJS.MD5(JSON.stringify(input2_check));
			var f_checkhash = $('#' + f_id).attr('data-zgfm-input2-hash');

			if (String(f_checkhash) === String(valhash)) {
			} else {
				$('#' + f_id).attr('data-zgfm-input2-hash', valhash);

				var newoptprev;
				obj.find('.uifm-input2-wrap').html('');

				switch (parseInt(f_type)) {
					case 8:

						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp2_templates').find('.sfdc-radio').clone();
							newoptprev.attr('data-inp2-opt-index', index);
							newoptprev.find('.uifm-inp2-rdo').prop('checked', parseInt(value['checked']));
							newoptprev.find('.uifm-inp2-rdo').attr('name', 'uifm_' + f_id + '_opt');
							newoptprev.find('.uifm-inp2-label').html(value['label']);

							obj.find('.uifm-input2-wrap').append(newoptprev.prop('outerHTML'));
						});

						if (parseInt(f_block_align) === 1) {
							obj.find('.uifm-input2-wrap .sfdc-radio').attr('class', 'sfdc-radio-inline');
						} else {
							obj.find('.uifm-input2-wrap .sfdc-radio-inline').attr('class', 'sfdc-radio');
						}


						$('#' + f_id).attr('data-zgfm-stl1-hash', '');

						if (parseInt(stl1_st) === 1) {
							this.previewfield_input2_stl1();
						}

						break;
					case 9:
						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp2_templates').find('.sfdc-checkbox').clone();
							newoptprev.attr('data-inp2-opt-index', index);
							newoptprev.find('.uifm-inp2-chk').prop('checked', parseInt(value['checked']));
							newoptprev.find('.uifm-inp2-chk').attr('name', 'uifm_' + f_id + '_opt');
							newoptprev.find('.uifm-inp2-label').html(value['label']);
							obj.find('.uifm-input2-wrap').append(newoptprev);
						});

						if (parseInt(f_block_align) === 1) {
							obj.find('.uifm-input2-wrap .sfdc-checkbox').attr('class', 'sfdc-checkbox-inline');
						} else {
							obj.find('.uifm-input2-wrap .sfdc-checkbox-inline').attr('class', 'sfdc-checkbox');
						}


						$('#' + f_id).attr('data-zgfm-stl1-hash', '');

						if (parseInt(stl1_st) === 1) {
							this.previewfield_input2_stl1();
						}

						break;
					case 10:
						obj.find('.uifm-input2-wrap').append('<select class="sfdc-form-control uifm-input2-opt-main" ></select>');
						$.each(values, function (index, value) {
							newoptprev = '<option data-inp2-opt-index="' + index + '" ';

							if (parseInt(value['checked']) === 1) {
								newoptprev += ' selected ';
							}
							newoptprev += ' > ' + value['label'] + ' </option>';
							obj.find('.uifm-input2-wrap select').append(newoptprev);
						});
						break;
					case 11:
						obj.find('.uifm-input2-wrap').append('<select class="sfdc-form-control uifm-input2-opt-main" multiple ></select>');
						$.each(values, function (index, value) {
							newoptprev = '<option data-inp2-opt-index="' + index + '" ';

							if (parseInt(value['checked']) === 1) {
								newoptprev += ' selected ';
							}
							newoptprev += ' > ' + value['label'] + ' </option>';
							obj.find('.uifm-input2-wrap select').append(newoptprev);
						});
						break;
				}

				var f_size = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'size'),
					f_bold = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'bold'),
					f_italic = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'italic'),
					f_underline = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'underline'),
					f_color = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'color');

				if (f_size) {
					obj.find('.uifm-input2-opt-main').css('font-size', f_size + 'px');
				}

				if (parseInt(f_bold) === 1) {
					obj.find('.uifm-input2-opt-main').css('font-weight', 'bold');
				} else {
					obj.find('.uifm-input2-opt-main').css('font-weight', 'normal');
				}

				if (parseInt(f_italic) === 1) {
					obj.find('.uifm-input2-opt-main').css('font-style', 'italic');
				} else {
					obj.find('.uifm-input2-opt-main').removeCss('font-style');
				}

				if (parseInt(f_underline) === 1) {
					obj.find('.uifm-input2-opt-main').css('text-decoration', 'underline');
				} else {
					obj.find('.uifm-input2-opt-main').removeCss('text-decoration');
				}

				obj.find('.uifm-input2-opt-main').removeCss('color');
				if (f_color) {
					obj.find('.uifm-input2-opt-main').css('color', f_color);
				}

				rocketform.previewfield_fontfamily(obj, 'input2', '.uifm-input2-opt-main');
			}
		};

		this.input2settings_statusRdoOption = function (el) {
			var f_id = settings['data']['id'];

			var opt_index = el.closest('.uifm-fld-inp2-options-row').data('opt-index');
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');
			var f_type = rocketform.getUiData4('steps_src', f_step, f_id, 'type');
			var opt_value;

			var stl1_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type');

			var options = rocketform.getUiData5('steps_src', parseInt(f_step), f_id, 'input2', 'options');

			switch (parseInt(f_type)) {
				case 8:
				case 10:
					if (options) {
						$.each(options, function (index2, value2) {
							rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', index2, 'checked', 0);
						});
					}
					break;
				case 9:
				case 11:
					var el_checked = el.is(':checked') ? 1 : 0;
					var el_box_index = el.closest('.uifm-fld-inp2-options-row');
					rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', el_box_index, 'checked', el_checked);

					break;
			}

			switch (parseInt(f_type)) {
				case 8:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_rdo').prop('checked') ? 1 : 0;
					break;
				case 9:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_chk').prop('checked') ? 1 : 0;
					break;
				case 10:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_rdo').prop('checked') ? 1 : 0;
					break;
				case 11:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_chk').prop('checked') ? 1 : 0;
					break;
			}

			rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', opt_index, 'checked', opt_value);
			var prev_el_sel = $('#' + f_id)
				.find('.uifm-input2-wrap ')
				.find("[data-inp2-opt-index='" + opt_index + "']");

			switch (parseInt(f_type)) {
				case 8:
				case 9:
					prev_el_sel.find('input').prop('checked', opt_value);

					if (parseInt(stl1_st) === 1) {
						if (opt_value === 1) {
							prev_el_sel.find('input').data('checkradios').form.radioEnable(prev_el_sel.find('input'));
						} else {
							prev_el_sel.find('input').data('checkradios').form.radioDisable(prev_el_sel.find('input'));
						}
					}

					break;
				case 10:

					break;
				case 11:

					break;
			}
		};

		this.previewfield_input2_stl1 = function () {
			var f_id = settings['data']['id'];
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			var stl_type = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type'),
				stl1_border_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color'),
				stl1_bg_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg_color'),
				stl1_icon_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color'),
				stl1_icon_mark = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_mark'),
				stl1_size = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'size');

			var f_values = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'stl1');
			$.extend(f_values, { style_type: stl_type });

			var valhash = CryptoJS.MD5(JSON.stringify(f_values));

			var f_checkhash = $('#' + f_id).attr('data-zgfm-stl1-hash');

			if (String(f_checkhash) === String(valhash)) {
			} else {
				$('#' + f_id).attr('data-zgfm-stl1-hash', valhash);
				$('#' + f_id)
					.find('.uifm-input2-wrap input')
					.unbind()
					.removeData();

				var tmp_inp, tmp_wrap;
				$.each($('#' + f_id).find('.uifm-input2-wrap .sfdc-radio'), function (index, value) {
					tmp_inp = $(this).find('.checkradios-radio input');
					tmp_wrap = $(this).find('.checkradios-radio');
					tmp_wrap.replaceWith(tmp_inp);
				});

				if (parseInt(stl_type) === 1) {

					$('#' + f_id)
						.find('.uifm-input2-wrap input')
						.checkradios({
							radio: {
								iconClass: 'fa ' + stl1_icon_mark
							}
						});

					var str_css = '';
					$('#' + f_id + '_stl1_css').remove();

					str_css = '<style type="text/css" id="' + f_id + '_stl1_css">';
					str_css += '#' + f_id + ' .checkradios-checkbox, #' + f_id + ' .checkradios-radio {';

					if (stl1_border_color) {
						str_css += 'border:2px solid ' + stl1_border_color + ';';
					}
					if (stl1_bg_color) {
						str_css += 'background: ' + stl1_bg_color + ';';
					}
					if (stl1_icon_color) {
						str_css += 'color: ' + stl1_icon_color + ';';
					}
					if (stl1_size) {
						str_css += 'font-size: ' + stl1_size + 'px;';
					}
					str_css += '} ';
					str_css += '</style>';
					$('head').append(str_css);
				} else {
				}
			}
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_radiobtn = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_radiobtn')) return;

			var myplugin = new uiformRadiobtn(this, options);

			element.data('uiform_radiobtn', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformRange = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 17,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'range',
				input4: {
					set_min: '-10',
					set_max: '1000',
					set_step: '1',
					set_range1: '250',
					set_range2: '750'
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-range').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input4',
					'.uifm-set-section-helpblock',
					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-input4-range',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_range = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_range')) return;

			var myplugin = new uiformRange(this, options);

			element.data('uiform_range', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformRatingstar = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 22,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'ratingstar',
				input9: {
					txt_star1: 'Very poor',
					txt_star2: 'poor',
					txt_star3: 'ok',
					txt_star4: 'good',
					txt_star5: 'Very Good',
					txt_norate: 'no rated'
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '2',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-timepicker').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-helpblock',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-input9',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_ratingstar = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_ratingstar')) return;

			var myplugin = new uiformRatingstar(this, options);

			element.data('uiform_ratingstar', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformRecaptcha = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 27,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'recaptcha',
				input5: {
					g_key_public: '',
					g_key_secret: '',
					g_theme: '0'
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-recaptcha').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',

					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input5',
					'.uifm-set-section-helpblock',

					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_recaptcha = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_recaptcha')) return;

			var myplugin = new uiformRecaptcha(this, options);

			element.data('uiform_recaptcha', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformSelect = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 10,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'select',
				input2: {
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '',
					font_st: 1,
					style_type: 1,
					options: {},
					stl1: {
						border_color: '#ccc',
						bg1_color1: '#fff',
						bg1_color2: '#e0e0e0',
						bg2_color1_h: '#e0e0e0',
						bg2_color2_h: '#e0e0e0',
						icon_color: '#000',
						search_st: '0',
						txt_noselected: 'Nothing selected',
						txt_noresult: 'No results match',
						txt_countsel: '{0} of {1} selected'
					}
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-select').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input2',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		this.input2settings_preview_genAllOptions = function () {

			var f_id = settings['data']['id'];
			var obj = $('#' + f_id);
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			var f_block_align = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'block_align');
			var f_type = rocketform.getUiData4('steps_src', f_step, f_id, 'type');
			var values = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'options');
			var stl1_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type');

			var input2_check = rocketform.getUiData4('steps_src', f_step, f_id, 'input2');

			var valhash = CryptoJS.MD5(JSON.stringify(input2_check));
			var f_checkhash = $('#' + f_id).attr('data-zgfm-input2-hash');

			if (String(f_checkhash) === String(valhash)) {
			} else {
				$('#' + f_id).attr('data-zgfm-input2-hash', valhash);

				var newoptprev;
				obj.find('.uifm-input2-wrap').html('');

				switch (parseInt(f_type)) {
					case 8:

						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp2_templates').find('.sfdc-radio').clone();
							newoptprev.attr('data-inp2-opt-index', index);
							newoptprev.find('.uifm-inp2-rdo').prop('checked', parseInt(value['checked']));
							newoptprev.find('.uifm-inp2-rdo').attr('name', 'uifm_' + f_id + '_opt');
							newoptprev.find('.uifm-inp2-label').html(value['label']);

							obj.find('.uifm-input2-wrap').append(newoptprev.prop('outerHTML'));
						});

						if (parseInt(f_block_align) === 1) {
							obj.find('.uifm-input2-wrap .sfdc-radio').attr('class', 'sfdc-radio-inline');
						} else {
							obj.find('.uifm-input2-wrap .sfdc-radio-inline').attr('class', 'sfdc-radio');
						}
						break;
					case 9:
						$.each(values, function (index, value) {
							newoptprev = $('#uifm_frm_inp2_templates').find('.sfdc-checkbox').clone();
							newoptprev.attr('data-inp2-opt-index', index);
							newoptprev.find('.uifm-inp2-chk').prop('checked', parseInt(value['checked']));
							newoptprev.find('.uifm-inp2-chk').attr('name', 'uifm_' + f_id + '_opt');
							newoptprev.find('.uifm-inp2-label').html(value['label']);
							obj.find('.uifm-input2-wrap').append(newoptprev);
						});

						if (parseInt(f_block_align) === 1) {
							obj.find('.uifm-input2-wrap .sfdc-checkbox').attr('class', 'sfdc-checkbox-inline');
						} else {
							obj.find('.uifm-input2-wrap .sfdc-checkbox-inline').attr('class', 'sfdc-checkbox');
						}


						$('#' + f_id).attr('data-zgfm-stl1-hash', '');

						if (parseInt(stl1_st) === 1) {
							this.previewfield_input2_stl1();
						}

						break;
					case 10:
						obj.find('.uifm-input2-wrap').append('<select class="sfdc-form-control uifm-input2-opt-main" ></select>');
						$.each(values, function (index, value) {
							newoptprev = '<option data-inp2-opt-index="' + index + '" ';

							if (parseInt(value['checked']) === 1) {
								newoptprev += ' selected ';
							}
							newoptprev += ' > ' + value['label'] + ' </option>';
							obj.find('.uifm-input2-wrap select').append(newoptprev);
						});

						$('#' + f_id).attr('data-zgfm-stl1-hash', '');
						if (parseInt(stl1_st) === 1) {
							this.previewfield_input2_stl1();
						}
						break;
					case 11:
						obj.find('.uifm-input2-wrap').append('<select class="sfdc-form-control uifm-input2-opt-main" multiple ></select>');
						$.each(values, function (index, value) {
							newoptprev = '<option data-inp2-opt-index="' + index + '" ';

							if (parseInt(value['checked']) === 1) {
								newoptprev += ' selected ';
							}
							newoptprev += ' > ' + value['label'] + ' </option>';
							obj.find('.uifm-input2-wrap select').append(newoptprev);
						});
						break;
				}

				if (parseInt(stl1_st) != 1) {
					var f_size = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'size'),
						f_bold = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'bold'),
						f_italic = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'italic'),
						f_underline = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'underline'),
						f_color = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'color');

					if (f_size) {
						obj.find('.uifm-input2-opt-main').css('font-size', f_size + 'px');
					}

					if (parseInt(f_bold) === 1) {
						obj.find('.uifm-input2-opt-main').css('font-weight', 'bold');
					} else {
						obj.find('.uifm-input2-opt-main').css('font-weight', 'normal');
					}

					if (parseInt(f_italic) === 1) {
						obj.find('.uifm-input2-opt-main').css('font-style', 'italic');
					} else {
						obj.find('.uifm-input2-opt-main').removeCss('font-style');
					}

					if (parseInt(f_underline) === 1) {
						obj.find('.uifm-input2-opt-main').css('text-decoration', 'underline');
					} else {
						obj.find('.uifm-input2-opt-main').removeCss('text-decoration');
					}

					obj.find('.uifm-input2-opt-main').removeCss('color');
					if (f_color) {
						obj.find('.uifm-input2-opt-main').css('color', f_color);
					}

					rocketform.previewfield_fontfamily(obj, 'input2', '.uifm-input2-opt-main');
				}
			}
		};

		this.input2settings_statusRdoOption = function (el) {
			var f_id = settings['data']['id'];

			var opt_index = el.closest('.uifm-fld-inp2-options-row').data('opt-index');
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');
			var f_type = rocketform.getUiData4('steps_src', f_step, f_id, 'type');
			var opt_value;

			var stl1_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type');

			var options = rocketform.getUiData5('steps_src', parseInt(f_step), f_id, 'input2', 'options');

			switch (parseInt(f_type)) {
				case 8:
				case 10:
					if (options) {
						$.each(options, function (index2, value2) {
							rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', index2, 'checked', 0);
						});
					}
					break;
				case 9:
				case 11:
					var el_checked = el.is(':checked') ? 1 : 0;
					var el_box_index = el.closest('.uifm-fld-inp2-options-row');
					rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', el_box_index, 'checked', el_checked);

					break;
			}

			switch (parseInt(f_type)) {
				case 8:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_rdo').prop('checked') ? 1 : 0;
					break;
				case 9:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_chk').prop('checked') ? 1 : 0;
					break;
				case 10:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_rdo').prop('checked') ? 1 : 0;
					break;
				case 11:
					opt_value = $('#uifm_frm_inp2_opt' + opt_index + '_chk').prop('checked') ? 1 : 0;
					break;
			}

			rocketform.setUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', opt_index, 'checked', opt_value);
			var prev_el_sel = $('#' + f_id)
				.find('.uifm-input2-wrap ')
				.find("[data-inp2-opt-index='" + opt_index + "']");

			switch (parseInt(f_type)) {
				case 8:
				case 9:
					prev_el_sel.find('input').prop('checked', opt_value);

					if (parseInt(stl1_st) === 1) {
						if (opt_value === 1) {
							prev_el_sel.find('input').data('checkradios').form.checkboxEnable(prev_el_sel.find('input'));
						} else {
							prev_el_sel.find('input').data('checkradios').form.checkboxDisable(prev_el_sel.find('input'));
						}
					}

					break;
				case 10:
					if (parseInt(stl1_st) === 0) {
						prev_el_sel.prop('selected', opt_value);
					} else if (parseInt(stl1_st) === 1) {
						var tmp_sel_val = rocketform.getUiData7('steps_src', parseInt(f_step), f_id, 'input2', 'options', opt_index, 'value');
						$('#' + f_id)
							.find('.uifm-input2-wrap ')
							.find('select')
							.selectpicker('val', tmp_sel_val);
					}
					break;
				case 11:

					break;
			}
		};

		this.previewfield_input2_stl1 = function () {
			var f_id = settings['data']['id'];
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			var stl_type = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'style_type'),
				stl1_border_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color'),
				stl1_bg1_color1 = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1'),
				stl1_bg1_color2 = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2'),
				stl1_bg2_color1_h = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h'),
				stl1_bg2_color2_h = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h'),
				stl1_search_st = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'search_st'),
				txt_noselected = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'txt_noselected'),
				txt_noresult = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'txt_noresult'),
				txt_countsel = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'txt_countsel'),
				inp_size = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'size'),
				inp_bold = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'bold'),
				inp_italic = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'italic'),
				inp_underline = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'underline'),
				inp_font = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'font'),
				inp_font_st = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'font_st'),
				inp_color = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'color'),
				stl1_icon_color = rocketform.getUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color');

			var f_values = rocketform.getUiData5('steps_src', f_step, f_id, 'input2', 'stl1');
			$.extend(f_values, { style_type: stl_type });

			var valhash = CryptoJS.MD5(JSON.stringify(f_values));

			var f_checkhash = $('#' + f_id).attr('data-zgfm-stl1-hash');

			if (String(f_checkhash) === String(valhash)) {
			} else {
				$('#' + f_id).attr('data-zgfm-stl1-hash', valhash);

				if (parseInt(stl_type) === 1) {

					if (
						$('#' + f_id)
							.find('.uifm-input2-wrap select')
							.data('selectpicker')
					) {

						if (parseInt(stl1_search_st) === 1) {
							$('#' + f_id)
								.find('.uifm-input2-wrap select')
								.attr('data-live-search', true);
						} else {
							$('#' + f_id)
								.find('.uifm-input2-wrap select')
								.attr('data-live-search', false);
						}

						$('#' + f_id)
							.find('.uifm-input2-wrap select')
							.selectpicker('refresh');
					} else {
						if (parseInt(stl1_search_st) === 1) {
							$('#' + f_id)
								.find('.uifm-input2-wrap select')
								.attr('class', 'selectpicker')
								.attr('data-live-search', 'true')
								.selectpicker();
						} else {
							$('#' + f_id)
								.find('.uifm-input2-wrap select')
								.attr('class', 'selectpicker')
								.attr('data-live-search', 'false')
								.selectpicker();
						}
					}


					var str_css = '';
					$('#' + f_id + '_stl1_css').remove();

					str_css = '<style type="text/css" id="' + f_id + '_stl1_css">';
					str_css += '#' + f_id + ' .uifm-input2-wrap button.sfdc-btn {';
					if (stl1_bg1_color1 && stl1_bg1_color2) {
						str_css += 'background-image: linear-gradient(to bottom, ' + stl1_bg1_color1 + ' 0%, ' + stl1_bg1_color2 + ' 100%)!important;';
					}

					if (stl1_border_color) {
						str_css += 'border-color:' + stl1_border_color + '!important;';
					}
					str_css += '} ';
					str_css += '#' + f_id + ' .uifm-input2-wrap button.sfdc-btn:hover, #' + f_id + ' .uifm-input2-wrap button.sfdc-btn:focus {';
					if (stl1_bg2_color1_h && stl1_bg2_color2_h) {
						str_css += 'background-image: linear-gradient(to bottom, ' + stl1_bg2_color1_h + ' 0%, ' + stl1_bg2_color2_h + ' 100%)!important;';
						str_css += 'background-position:0 0!important;';
					}

					if (stl1_border_color) {
						str_css += 'border-color:' + stl1_border_color + '!important;';
					}
					str_css += '} ';
					str_css += '#' + f_id + ' .uifm-input2-wrap .sfdc-bs-caret {';

					if (stl1_icon_color) {
						str_css += 'color:' + stl1_icon_color + '!important;';
					}
					str_css += '} ';

					str_css += '#' + f_id + ' .uifm-input2-wrap .filter-option {';

					if (inp_color) {
						str_css += 'color:' + inp_color + '!important;';
						str_css += 'text-shadow:0 1px 0 ' + inp_color + '!important;';
					}

					if (parseInt(inp_bold) === 1) {
						str_css += 'font-weight:bold;';
					} else {
						str_css += 'font-weight:normal;';
					}

					if (parseInt(inp_italic) === 1) {
						str_css += 'font-style:italic;';
					}

					if (parseInt(inp_underline) === 1) {
						str_css += 'text-decoration:underline;';
					}

					if (inp_size) {
						str_css += 'font-size:' + inp_size + ';';
					}

					str_css += '} ';

					str_css += '#' + f_id + ' .uifm-input2-wrap .filter-option,';
					str_css += '#' + f_id + ' .bootstrap-select.sfdc-btn-group .sfdc-dropdown-menu li a span.text {';

					if (parseInt(inp_font_st) === 1 && inp_font) {
						var font_sel = JSON.parse(inp_font);
						str_css += 'font-family:' + font_sel.family + ';';
					}

					str_css += '} ';

					str_css += '</style>';
					$('head').append(str_css);

					rocketform.previewfield_fontfamily2($('#' + f_id), 'input2');
				} else {
					if (
						$('#' + f_id)
							.find('.uifm-input2-wrap select')
							.data('selectpicker')
					) {
						$('#' + f_id)
							.find('.uifm-input2-wrap select')
							.selectpicker('destroy');
					}
					$('#' + f_id)
						.find('.uifm-input2-wrap select')
						.attr('class', 'sfdc-form-control uifm-input2-opt-main')
						.removeAttr('data-live-search');
				}
			}
		};

		this.input2settings_stl1_quickcolor = function (option) {
			var f_id = settings['data']['id'];
			var f_step = $('#' + f_id)
				.closest('.uiform-step-pane')
				.data('uifm-step');

			switch (parseInt(option)) {
				case 1:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#ccc');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#fff');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#e0e0e0');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#e0e0e0');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#e0e0e0');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#000');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#000');

					break;
				case 2:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#245580');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#337ab7');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#265a88');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#265a88');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#265a88');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				case 3:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#3e8f3e');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#5cb85c');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#419641');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#419641');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#419641');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				case 4:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#28a4c9');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#5bc0de');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#2aabd2');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#2aabd2');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#2aabd2');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				case 5:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#e38d13');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#f0ad4e');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#eb9316');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#eb9316');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#eb9316');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				case 6:
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'border_color', '#b92c28');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color1', '#d9534f');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg1_color2', '#c12e2a');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color1_h', '#c12e2a');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'bg2_color2_h', '#c12e2a');
					rocketform.setUiData6('steps_src', f_step, f_id, 'input2', 'stl1', 'icon_color', '#fff');
					rocketform.setUiData5('steps_src', f_step, f_id, 'input2', 'color', '#fff');

					break;
				default:
					break;
			}

			var tabobject = $('#uifm-field-selected-id').parent();

			var data_field = settings['data']['input2'];
			var f_id = settings['data']['id'];
			var obj_field = $('#' + f_id);
			var f_store_a;

			$.each(data_field, function (index, value) {
				if ($.isPlainObject(value)) {
					$.each(value, function (index2, value2) {
						if ($.isPlainObject(value2)) {
							$.each(value2, function (index3, value3) {
								if ($.isPlainObject(value3)) {
									$.each(value3, function (index4, value4) {
										f_store_a = [];
										f_store_a.push('input2');
										f_store_a.push(index);
										f_store_a.push(index2);
										f_store_a.push(index3);
										f_store_a.push(index4);

										rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value4);
										rocketform.setDataOptToPrevField(obj_field, f_store_a.join('-'), value4);
									});
								} else {
									f_store_a = [];
									f_store_a.push('input2');
									f_store_a.push(index);
									f_store_a.push(index2);
									f_store_a.push(index3);

									rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value3);
									rocketform.setDataOptToPrevField(obj_field, f_store_a.join('-'), value3);
								}
							});
						} else {
							f_store_a = [];
							f_store_a.push('input2');
							f_store_a.push(index);
							f_store_a.push(index2);

							rocketform.setDataOptToSetTab(tabobject, f_store_a.join('-'), value2);
							rocketform.setDataOptToPrevField(obj_field, f_store_a.join('-'), value2);
						}
					});
				} else {
				}
			});
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_select = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_select')) return;

			var myplugin = new uiformSelect(this, options);

			element.data('uiform_select', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformSlider = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 16,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'slider',
				input4: {
					set_min: '-5',
					set_max: '1000',
					set_default: '500',
					set_step: '1'
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-slider').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input4',
					'.uifm-set-section-helpblock',
					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-input4-defaultvalue',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_slider = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_slider')) return;

			var myplugin = new uiformSlider(this, options);

			element.data('uiform_slider', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformSpinner = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 18,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'spinner',
				input4: {
					set_min: '0',
					set_max: '1000',
					set_default: '5',
					set_step: '1',
					set_decimal: '0',
					skin_maxwidth_st: '1',
					skin_maxwidth: '200'
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-spinner').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input4',
					'.uifm-set-section-input4-skin-maxwidth',
					'.uifm-set-section-helpblock',

					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-input4-defaultvalue',
					'.uifm-set-section-input4-spinner-opts',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};
		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_spinner = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_spinner')) return;

			var myplugin = new uiformSpinner(this, options);

			element.data('uiform_spinner', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformSubmitbtn = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 20,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'submitbtn',
				input: {
					value: 'Submit button',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#ffffff',
					font: '',
					font_st: 1,
					val_align: '',
					obj_align: ''
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '0',
					block_align: '0',
					grid_layout: '2'
				},
				el_background: {
					show_st: '1',
					type: '2',
					start_color: '#55acf8',
					end_color: '#2d6ca2',
					solid_color: '#ffffff'
				},
				el_border_radius: {
					show_st: '1',
					size: '17'
				},
				el_border: {
					show_st: '1',
					color: '#000',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '0'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-submitbtn').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-inputtextbox',
					'.uifm-set-section-input-placeh',
					'.uifm-set-section-inputboxbg',
					'.uifm-set-section-inputboxborder',
					'.uifm-set-section-input-objalign',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-input1-txtvalue',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_submitbtn = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_submitbtn')) return;

			var myplugin = new uiformSubmitbtn(this, options);

			element.data('uiform_submitbtn', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformSwitch = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 40,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'switch',
				input15: {
					txt_yes: 'Yes',
					txt_no: 'No'
				},
				price: {
					enable_st: '1',
					lbl_show_st: '1',
					lbl_show_format: '%3Cp%3E(%5Buifm_symbol%5D%20%5Buifm_price%5D%20%5Buifm_currency%5D)%3C%2Fp%3E',
					color: '#FF0000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					unit_price: '1'
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-timepicker').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-input15',
					'#uifm-custom-val-req-btn',
					'.uifm-set-section-input15',
					'.uifm-set-section-pricesetting',
					'.uifm-set-section-pricesetting2',
					'.uifm-set-section-inputprice',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_switch = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_switch')) return;

			var myplugin = new uiformSwitch(this, options);

			element.data('uiform_switch', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformTextarea = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 7,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'textarea',
				input: {
					value: '',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					placeholder: '',
					color: '#000',
					font: '',
					font_st: 1,
					val_align: ''
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				el_background: {
					show_st: '1',
					type: '1',
					start_color: '',
					end_color: '',
					solid_color: '#ffffff'
				},
				el_border_radius: {
					show_st: '1',
					size: '0'
				},
				el_border: {
					show_st: '1',
					color: '#ddd',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '1'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-textarea').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input-placeh',
					'.uifm-set-section-inputtextbox',
					'.uifm-set-section-inputboxbg',
					'.uifm-set-section-inputboxborder',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'#uifm-custom-val-alpha-btn',
					'#uifm-custom-val-alphanum-btn',
					'#uifm-custom-val-num-btn',
					'#uifm-custom-val-mail-btn',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-input1-txtvalue',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_textarea = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_textarea')) return;

			var myplugin = new uiformTextarea(this, options);

			element.data('uiform_textarea', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformTextbox = function (element, options) {
		var field_step = null;
		var field_oncreation = false;

		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 6,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'textbox',
				input: {
					value: '',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					placeholder: '',
					color: '#000',
					font: '',
					font_st: 1,
					val_align: ''
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				el_background: {
					show_st: '1',
					type: '1',
					start_color: '',
					end_color: '',
					solid_color: '#ffffff'
				},
				el_border_radius: {
					show_st: '1',
					size: '0'
				},
				el_border: {
					show_st: '0',
					color: '#000',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '1'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					customval_regex: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};

		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-textbox').clone();
			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);

				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);

			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-input-valign',
					'.uifm-set-section-input-placeh',
					'.uifm-set-section-inputtextbox',
					'.uifm-set-section-inputboxbg',
					'.uifm-set-section-inputboxborder',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'.zgfm-set-section-custominput-box',
					'#uifm-custom-val-req-btn',
					'#uifm-custom-val-alpha-btn',
					'#uifm-custom-val-alphanum-btn',
					'#uifm-custom-val-num-btn',
					'#uifm-custom-val-mail-btn',
					'.uifm-set-section-input1-lbltxt',
					'.uifm-set-section-input1-sublbltxt',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-input1-txtvalue',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};

		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_textbox = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_textbox')) return;

			var myplugin = new uiformTextbox(this, options);

			element.data('uiform_textbox', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformTimepicker = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 25,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'timepicker',
				input7: {
					format: ''
				},
				label: {
					text: 'Text label',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				sublabel: {
					text: '',
					size: '14',
					bold: 1,
					italic: 1,
					underline: 0,
					color: '#000',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					shadow_st: 0,
					shadow_color: '#666',
					shadow_x: 1,
					shadow_y: 1,
					shadow_blur: 3
				},
				txt_block: {
					block_pos: '1',
					block_st: '1',
					block_align: '0',
					grid_layout: '2'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				validate: {
					typ_val: '0',
					typ_val_custxt: '',
					pos: '0',
					tip_col: '#000000',
					tip_bg: '#ffffff',
					reqicon_st: '0',
					reqicon_pos: '0',
					reqicon_img: 'glyphicon-asterisk'
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-timepicker').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-set-section-fieldname',
					'.uifm-tab-fld-label',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-validation',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-label',
					'.uifm-set-section-sublabel',
					'.uifm-set-section-blocktxt',
					'.uifm-set-section-helpblock',
					'.uifm-set-section-validator',
					'#uifm-custom-val-req-btn',
					'#uifm-fld-inp2-block-align-box',
					'.uifm-set-section-input4-defaultvalue',
					'.uifm-set-section-label-lbltxt',
					'.uifm-set-section-label-sublbltxt',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});

				if ('#uiform-settings-tab-1') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-1"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setFieldName = function (id) {
			settings.data['field_name'] = settings.data['type_n'] + id;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};
		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_timepicker = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_timepicker')) return;

			var myplugin = new uiformTimepicker(this, options);

			element.data('uiform_timepicker', myplugin);
		});
	};
})($uifm);

(function ($) {
	var uiformWizardbtn = function (element, options) {
		var field_step = null;
		var field_oncreation = false;
		var elem = $(element);
		var obj_main = this;
		var obj_quick_options = null;
		var defaults = {
			data: {
				type: 39,
				id: '',
				skin: {
					margin: {
						show_st: 1,
						top: '5',
						bottom: '5',
						left: '0',
						right: '0'
					},
					padding: {
						show_st: 1,
						top: '0',
						bottom: '0',
						left: '0',
						right: '0'
					},
					custom_css: {
						ctm_id: '',
						ctm_class: '',
						ctm_additional: ''
					}
				},
				field_name: '',
				order_frm: '0',
				type_n: 'wizardbtn',
				input12: {
					value_lbl: 'Next',
					value_lbl_last: 'Finish',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#ffffff',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					val_align: ''
				},
				input13: {
					value_lbl: 'Prev',
					size: '14',
					bold: 0,
					italic: 0,
					underline: 0,
					color: '#ffffff',
					font: '{"family":"\'Comic Sans MS\', Arial, sans-serif","name":"Comic Sans MS","classname":"comicsansms"}',
					font_st: 1,
					val_align: ''
				},
				input14: {
					obj_align: '2'
				},
				el12_background: {
					show_st: '1',
					type: '2',
					start_color: '#55acf8',
					end_color: '#2d6ca2',
					solid_color: '#ffffff'
				},
				el13_background: {
					show_st: '1',
					type: '2',
					start_color: '#abbac3',
					end_color: '#899398',
					solid_color: '#ffffff'
				},
				el12_border_radius: {
					show_st: '0',
					size: '5'
				},
				el13_border_radius: {
					show_st: '0',
					size: '5'
				},
				el12_border: {
					show_st: '0',
					color: '#000',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '0'
				},
				el13_border: {
					show_st: '0',
					color: '#000',
					color_focus_st: '0',
					color_focus: '#000',
					style: '1',
					width: '0'
				},
				help_block: {
					text: 'here your content',
					show_st: '0',
					font: '',
					font_st: '0',
					pos: ''
				},
				clogic: {
					show_st: '0',
					f_show: '1',
					f_all: '1',
					list: []
				}
			}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		var privateMethod = function () {};

		var typeID = function () {
			return field_type;
		};
		var getHtmlField = function (element) {
			var fieldhtml = $('#uiform-fields-templates .uiform-submitbtn').clone();

			var id = 'ui' + rocketform.generateUniqueID();
			fieldhtml.attr('id', id);
			var step_pane = $(element).closest('.uiform-step-pane').data('uifm-step');

			var settings = $.extend(true, {}, defaults, options || {});
			settings.id = id;
			$('#' + id).data('uifm-settings', settings);

			return fieldhtml;
		};
		var setData = function (step_index, id_element) {};

		this.testingdata = function () {
			console.log('data from plugin : ' + rocketform.dumpvar2(settings.data));
		};
		this.updateVarData = function (id) {
			$('#' + id).data('uifm-settings', settings);
		};
		this.update_previewfield = function (id_element) {
			var obj_field = $('#' + id_element);
			if (obj_field) {
				rocketform.loadForm_updatePreviewField(id_element, settings.data);
			}
		};
		this.loadSettingDataTab = function (id_element) {
			this.showSettingTab(id_element);

		};
		this.onWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			var tmp_tmpl = wp.template('zgpb-quick-options');
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
				$(this).append(
					tmp_tmpl({
						type: settings.data.type,
						id: settings.data.id
					})
				);
			}

			obj_quick_options = elem.find('.zgpb-fields-quick-options2');
			obj_main.refresh_quickopt_position();
		};

		this.offWholeHover = function (e) {
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
				$(this).find('.zgpb-fields-quick-options2').remove();
			}
		};

		this.init_events = function () {
			elem.on('mouseenter', obj_main.onWholeHover);
			elem.on('mouseleave', obj_main.offWholeHover);

			$(window).scroll(function () {
				obj_main.refresh_quickopt_position();
			});
		};

		this.refresh_quickopt_position = function () {
			if (obj_quick_options && obj_quick_options.is(':visible')) {
				var elemTop = $(elem).offset().top || null;
				var elemBottom = elemTop + $(elem).height();

				var docViewTop = $(window).scrollTop();

				var docViewBottom = docViewTop + $(window).height();

				var tmp_new_top;

				if (elemTop > docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = ((elemBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop > docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = ((docViewBottom - elemTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom < docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + (elemBottom - docViewTop) / 2).toString() + 'px';
				} else if (elemTop < docViewTop && elemBottom > docViewBottom) {
					tmp_new_top = (docViewTop - elemTop + $(window).height() / 2).toString() + 'px';
				} else {
					tmp_new_top = '50%';
				}

				obj_quick_options.css('top', tmp_new_top);
			}
		};

		this.enableSettingOptions = function (f_data, addt) {

			this.showSettingTab();

			if (rocketform.checkIntegrityDataField(f_data['id'])) {
				this.enableSettingOptions_process(f_data, true, true);

				rocketform.setDataToSettingTabAndPreview(f_data['id'], settings.data);
				rocketform.loading_boxField('zgfm-panel-right-field-tabopt', 0);

				if (field_oncreation) {
					rocketform.loading_boxField(f_data['id'], 0);
					field_oncreation = false;
				}
				$('#uiform-build-field-tab').removeClass('zgfm-fieldtab-flag-loading');
			}
		};

		this.setVariables = function ($vars) {
			field_oncreation = $vars['oncreation'] || false;
		};

		this.enableSettingOptions_process = function (f_data, update_modal, update_preview) {
			var tab = $('#uifm-field-opt-content');
			rocketform.fields_events_bswitch(tab);
			rocketform.fields_events_spinner(tab);
			rocketform.fields2_events_spinner(tab);
			rocketform.fields_events_general();
			rocketform.fields_events_cpicker(tab);
			rocketform.fields_events_slider(tab);
			rocketform.fields_events_select(tab);
                        rocketform.fields2_events_txts(tab);
		};

		this.showSettingTab = function (id_element) {
			var idselected = $('#uifm-field-selected-id').val();
			if (String(idselected) != String(id_element)) {
				rocketform.cleanSettingTab();
				var clvars = [
					'.uifm-tab-fld-input',
					'.uifm-tab-fld-helpblock',
					'.uifm-tab-fld-logicrls',
					'.uifm-set-section-input12',
					'.uifm-set-section-input12boxbg',
					'.uifm-set-section-input12boxborder',
					'.uifm-set-section-input13',
					'.uifm-set-section-input13boxbg',
					'.uifm-set-section-input13boxborder',

					'.uifm-set-section-helpblock',
					'.uifm-set-section-helpblock-text',
					'.uifm-tab-fld-moreopt'
				];
				$.each(clvars, function () {
					$(String(this)).removeClass('uifm-hide');
				});
				if ('#uiform-settings-tab-2') {
					$('.sfdc-nav-tabs a[href="#uiform-settings-tab-2"]').sfdc_tab('show');
				}
			}

			rocketform.checkScrollTab();
		};
		this.setToDatalvl1 = function (option, value) {
			settings.data[option] = value;
		};
		this.setDataToCoreStore = function (step_pane, id) {

			rocketform.setUiData3('steps_src', step_pane, id, settings.data);
		};

		this.update_settingsData = function (options) {
			var settings2 = $.extend(true, {}, settings, { data: options });
			var settings3 = uifm_validate_field(settings2, settings);
			settings = settings3;
		};

		this.setDataToCore = function (tmp_vars) {
			var id = tmp_vars['id'],
				f_opt1 = tmp_vars['opt1'],
				f_opt2 = tmp_vars['opt2'],
				f_opt3 = tmp_vars['opt3'],
				f_opt4 = tmp_vars['opt4'];

			switch (String(f_opt1)) {
				case 'skin':
				default:
					rocketform.setUiData6('steps_src', field_step, String(id), String(f_opt1), String(f_opt2), String(f_opt3), f_opt4);
			}
		};

		this.setStep = function (step) {
			field_step = step;
		};

		var getTestData = function () {
			var id_element = $('.uiform-items-container .uiform-field:first').attr('id');
			console.log(id_element);
			var data = rocketform.getFieldById(id_element);
			console.log(data.input.type);
		};
	};

	$.fn.uiform_wizardbtn = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('uiform_wizardbtn')) return;

			var myplugin = new uiformWizardbtn(this, options);

			element.data('uiform_wizardbtn', myplugin);
		});
	};
})($uifm);

if (typeof $uifm === 'undefined') {
	$uifm = jQuery;
}
var zgfm_back_err = zgfm_back_err || null;
if (!$uifm.isFunction(zgfm_back_err)) {
	(function ($, window) {
		'use strict';

		var zgfm_back_err = function () {
			var zgfm_variable = [];
			zgfm_variable.innerVars = {};
			zgfm_variable.externalVars = {};

			this.initialize = function () {};

			this.integrity_check = function () {
				if (this.error_is_found()) {
					this.error_openModal();
				} else {
				}
			};


			this.error_is_found = function () {
				var result;
				result = false;


				var result_err = [];

				var tmp_arr = rocketform.getUiData('steps_src');
				var tmp_fld_exist;
				for (var i in tmp_arr) {
					for (var i2 in tmp_arr[i]) {
						tmp_fld_exist = $('#zgpb-editor-container').find('#' + tmp_arr[i][i2]['id']).length;
						if (tmp_fld_exist == 0) {
							result_err.push(tmp_arr[i][i2]['id']);
						}
					}
				}

				if (result_err.length) {
					result = true;
				}

				result_err = [];
				var tmp_arr2 = $('#zgpb-editor-container').find('.uiform-main-form .uiform-items-container .zgpb-field-template');
				$.each(tmp_arr2, function (index, element) {
					if (zgfm_back_err.check_IdIsInArray(tmp_arr, $(element).attr('id'))) {
					} else {
						result_err.push($(element).attr('id'));
					}
				});

				if (result_err.length) {
					result = true;
				}

				tmp_arr = null;

				return result;
			};


			this.check_IdIsInArray = function (tmp_arr, id) {
				var result = false;

				for (var i in tmp_arr) {
					for (var i2 in tmp_arr[i]) {
						if (String(tmp_arr[i][i2]['id']) === String(id)) {
							result = true;
							break;
						} else {
						}
					}
				}

				return result;
			};


			this.error_openModal = function () {
				try {
					rocketform.fields_showModalOptions();

					$.ajax({
						type: 'POST',
						url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_integrity_openmodal',
						data: {
							action: 'rocket_fbuilder_integrity_openmodal',
							page: 'zgfm_form_builder',
							zgfm_security: uiform_vars.ajax_nonce,
							csrf_field_name: uiform_vars.csrf_field_name
						},
						success: function (msg) {
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-header-inner').html(msg.modal_header);
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.sfdc-modal-body').html(msg.modal_body);
							$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-footer-wrap').html(msg.modal_footer);
						}
					});
				} catch (ex) {
					console.error('zgfm_back_err error_openModal ', ex.message);
				}
			};
		};
		window.zgfm_back_err = zgfm_back_err = $.zgfm_back_err = new zgfm_back_err();
	})($uifm, window);
}

if (typeof $uifm === 'undefined') {
	$uifm = jQuery;
}
var zgfm_back_fld_options = zgfm_back_fld_options || null;
if (!$uifm.isFunction(zgfm_back_fld_options)) {
	(function ($, window) {
		'use strict';

		var zgfm_back_fld_options = function () {
			var zgfm_variable = [];
			zgfm_variable.innerVars = {};
			zgfm_variable.externalVars = {};

			this.initialize = function () {};

			this.generate_field_htmldata = function () {
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/fields/ajax_dev_genfieldopts',
					data: {
						action: 'rocket_fbuilder_dev_generate_fieldopt',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					beforeSend: function () {},
					success: function (response) {
						alert('generate field options finished');
					}
				});
			};

			this.load_on_selecteField = function (tmp_fld_load, msg) {
				var block;

				var id = tmp_fld_load['id'];
				var type = tmp_fld_load['typefield'];
				var step_pane = tmp_fld_load['step_pane'];
				var addt = tmp_fld_load['addt'];
				var oncreation = tmp_fld_load['oncreation'] || false;

				var field_vars = [];
				field_vars['oncreation'] = oncreation;

				var flag_tinymce_loaded;

				var tmp_field_inst;
				rocketform.tinymceEvent_removeInst();

				if (false) {
					$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-header-inner').html(msg.modal_header);
					$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.sfdc-modal-body').html('');
					rocketform.modal_field_loader(1);
					$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.sfdc-modal-body').append(msg.modal_body);
					$('#zgpb-modal1').find('.sfdc-modal-dialog').find('.zgpb-modal-footer-wrap').html(msg.modal_footer);
				} else {
					$('#uiform-build-field-tab').html(msg.modal_body);
				}

				$('input,textarea').attr('autocomplete', 'off');
				$('#zgfm_edit_panel').disableAutoFill({
					passwordField: '.password'
				});

				$('#uifm-field-selected-id').val(id);
				$('#uifm-field-selected-type').val(type);

				var f_data = rocketform.getUiData3('steps_src', step_pane, id);

				switch (parseInt(type)) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						var block = addt ? addt['block'] : 0;
						$('#zgpb-field-selected-block').val(block);
						tmp_field_inst = $('#' + id).data('zgpbld_gridsystem');

						tmp_field_inst.setVariables(field_vars);
						tmp_field_inst.enableSettingOptions(f_data, addt);

						break;
					case 6:
					case 7:
					case 8:

					case 9:

					case 10:

					case 11:

					case 12:

					case 13:

					case 14:

					case 15:

					case 16:

					case 17:

					case 18:

					case 19:

					case 20:

					case 21:

					case 22:

					case 23:

					case 24:

					case 25:

					case 26:

					case 27:
					case 28:
					case 29:
					case 30:
					case 31:
					case 32:
					case 33:
					case 34:
					case 35:
					case 36:
					case 37:
					case 38:
					case 39:
					case 40:
					case 41:
					case 42:

					case 43:
						rocketform.tinymceEvent_init();

						flag_tinymce_loaded = false;
						var zgpb_afterdrag_timer_2;

						zgpb_afterdrag_timer_2 = setInterval(function () {
							if (rocketform.checkIntegrityTinyMCE(type)) {
								var tmp_field_inst;
								switch (parseInt(type)) {
									case 6:
										tmp_field_inst = $('#' + id).data('uiform_textbox');
										break;
									case 7:
										tmp_field_inst = $('#' + id).data('uiform_textarea');
										break;
									case 8:
										tmp_field_inst = $('#' + id).data('uiform_radiobtn');
										break;
									case 9:
										tmp_field_inst = $('#' + id).data('uiform_checkbox');
										break;
									case 10:
										tmp_field_inst = $('#' + id).data('uiform_select');
										break;
									case 11:
										tmp_field_inst = $('#' + id).data('uiform_multiselect');
										break;
									case 12:
										tmp_field_inst = $('#' + id).data('uiform_fileupload');
										break;
									case 13:
										tmp_field_inst = $('#' + id).data('uiform_imageupload');
										break;
									case 14:
										tmp_field_inst = $('#' + id).data('uiform_customhtml');
										break;
									case 15:
										tmp_field_inst = $('#' + id).data('uiform_password');
										break;
									case 16:
										tmp_field_inst = $('#' + id).data('uiform_slider');
										break;
									case 17:
										tmp_field_inst = $('#' + id).data('uiform_range');
										break;
									case 18:
										tmp_field_inst = $('#' + id).data('uiform_spinner');
										break;
									case 19:
										tmp_field_inst = $('#' + id).data('uiform_captcha');
										break;
									case 20:
										tmp_field_inst = $('#' + id).data('uiform_submitbtn');
										break;
									case 21:
										tmp_field_inst = $('#' + id).data('uiform_hiddeninput');
										break;
									case 22:
										tmp_field_inst = $('#' + id).data('uiform_ratingstar');
										break;
									case 23:
										tmp_field_inst = $('#' + id).data('uiform_colorpicker');
										break;
									case 24:
										tmp_field_inst = $('#' + id).data('uiform_datepicker');
										break;
									case 25:
										tmp_field_inst = $('#' + id).data('uiform_timepicker');
										break;
									case 26:
										tmp_field_inst = $('#' + id).data('uiform_datetime');
										break;
									case 27:
										tmp_field_inst = $('#' + id).data('uiform_recaptcha');
										break;
									case 28:
										tmp_field_inst = $('#' + id).data('uiform_preptext');
										break;
									case 29:
										tmp_field_inst = $('#' + id).data('uiform_appetext');
										break;
									case 30:
										tmp_field_inst = $('#' + id).data('uiform_prepapptext');
										break;
									case 31:
										tmp_field_inst = $('#' + id).data('uiform_panelfld');
										break;
									case 32:
										tmp_field_inst = $('#' + id).data('uiform_divider');
										break;
									case 33:
									case 34:
									case 35:
									case 36:
									case 37:
									case 38:
										tmp_field_inst = $('#' + id).data('uiform_heading');
										break;
									case 39:
										tmp_field_inst = $('#' + id).data('uiform_wizardbtn');
										break;
									case 40:
										tmp_field_inst = $('#' + id).data('uiform_switch');
										break;
									case 41:
										tmp_field_inst = $('#' + id).data('uiform_dyncheckbox');
										break;
									case 42:
										tmp_field_inst = $('#' + id).data('uiform_dynradiobtn');
										break;
									case 43:
										tmp_field_inst = $('#' + id).data('uifm_datepickr_flat');
										break;
								}

								tmp_field_inst.setVariables(field_vars);
								tmp_field_inst.enableSettingOptions(f_data, addt);

								clearInterval(zgpb_afterdrag_timer_2);
								zgpb_afterdrag_timer_2 = null;
							}
						}, 300);

						break;

					default:
				}

				var tmp_fast_load = uiform_vars.fields_fastload;
				if (parseInt(tmp_fast_load) === 1) {
					zgfm_back_fld_options.selfld_settings_form_more();
					zgfm_back_fld_options.selfld_field_opt_column();
					zgfm_back_fld_options.selfld_field_opt_text();
				}

				if (false) {
					$('#zgpb-modal1').find('[data-toggle="tooltip"]').tooltip();
				} else {
					$('#uiform-build-field-tab').find('[data-toggle="tooltip"]').tooltip();
				}

				$('#uifm-field-selected-id').val(id);

				var tmp_height = $('.uiform-builder-maintab-container .uiform-tab-content').first().height();

				$('#uifm-field-opt-content .uiform-tab-content').height(tmp_height);

				let tmp_addon_arr = uiform_vars.addon;

				var tmp_function;
				var tmp_controller;

				for (var property1 in tmp_addon_arr) {
					if ('getData_toFields' === String(property1)) {
						for (var property2 in tmp_addon_arr[property1]) {
							for (var property3 in tmp_addon_arr[property1][property2]) {
								tmp_controller = tmp_addon_arr[property1][property2][property3]['controller'];
								tmp_function = tmp_addon_arr[property1][property2][property3]['function'];
								window[tmp_controller][tmp_function](step_pane, id);
							}
						}
					}
				}

				var pickfield = $('#' + id);

				if (pickfield && pickfield.attr('id')) {
					var idselected = $('#uifm-field-selected-id').val();

					if (idselected != pickfield.attr('id') || (!$('.uifm-tab-selectedfield').is(':visible') && idselected)) {
						rocketform.previewfield_hidePopOver();
						rocketform.previewfield_removeAllPopovers();
						rocketform.previewfield_removeAllUndesiredObj(pickfield);
						rocketform.previewfield_helpblock_hidetooltip();
					}
				}
			};


			this.selfld_settings_form_more = function () {
				$uifm(function ($) {
					$('#zgpb_fld_col_ctmid').val('rockfm_' + $('#uifm-field-selected-id').val());
				});
			};


			this.selfld_field_opt_column = function () {
				$uifm(function ($) {
					$('#zgpb_fld_col_bg_type_1').on('click', function () {
						$('#zgpb_fld_col_bg_type_1_cont').show();
						$('#zgpb_fld_col_bg_type_2_cont').hide();
					});

					$('#zgpb_fld_col_bg_type_2').on('click', function () {
						$('#zgpb_fld_col_bg_type_1_cont').hide();
						$('#zgpb_fld_col_bg_type_2_cont').show();
					});

					$('#zgpb_fld_col_bg_sizetype').on('click', function () {
						var sVal = $(this).val();
						if (parseInt(sVal) === 1 || parseInt(sVal) === 2) {
							$('#zgpb_fld_col_bg_sizetype_len_wrap').show();
						} else {
							$('#zgpb_fld_col_bg_sizetype_len_wrap').hide();
						}
					});
				});

				jQuery(function ($) {
					$('#zgpb_fld_col_ctmid').val('rockfm_' + $('#uifm-field-selected-id').val());
				});
			};


			this.selfld_field_opt_text = function () {
				jQuery(function ($) {
					$('#zgpb-field-opt-content')
						.find('select.sfm')
						.change(function () {
							var font_sel = $(this).data('stylesFontMenu').uifm_preview_font_change();
							var f_store = $(this).data('field-store');
							var f_val = JSON.stringify(font_sel);
							zgpb_core.updateModalFieldCoreAndPreview(f_store, f_val);
						});
				});
				$uifm(function ($) {
					$('#zgpb-field-opt-content .sfdc-input-group-btn > .sfdc-btn').click(function () {
						var element = $(this),
							input = element.find('input');
						if (parseInt(input.val()) === 0) {
							element.addClass('sfdc-active');
							input.val(1);
						} else {
							element.removeClass('sfdc-active');
							input.val(0);
						}
					});

					$("#zgpb-field-opt-content .sfdc-btn-group > .sfdc-btn[data-settings-option='group-radiobutton']").click(function () {
						var element = $(this),
							parent = element.parent();
						parent
							.children('.sfdc-btn[data-toggle-enable]')
							.removeClass(function () {
								return $(this).data('toggle-enable');
							})
							.addClass(function () {
								return $(this).data('toggle-disable');
							})
							.children('input')
							.prop('checked', false);
						element.removeClass($(this).data('toggle-disable')).addClass(element.data('toggle-enable'));
						element.children('input').prop('checked', true);
					});
				});
			};
		};
		window.zgfm_back_fld_options = zgfm_back_fld_options = $.zgfm_back_fld_options = new zgfm_back_fld_options();
	})($uifm, window);
}

if (typeof $uifm === 'undefined') {
	$uifm = jQuery;
}
var zgfm_back_general = zgfm_back_general || null;
if (!$uifm.isFunction(zgfm_back_general)) {
	(function ($, window) {
		'use strict';

		var zgfm_back_general = function () {
			var zgfm_variable = [];
			zgfm_variable.innerVars = {};
			zgfm_variable.externalVars = {};

			this.initialize = function () {};

			this.formslist_search_refresh = function () {
				this.formslist_search_process(0);
			};

			this.formslist_search_refresh_save = function () {
				this.formslist_search_process(1);

				alert('Filter paramaters saved');
			};

			this.formslist_search_process = function (opt_save) {
				var tmp_params = $('#zgfm-listform-filter-panel-form').serialize();

				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_formlist_sendfilter',
					data: {
						action: 'zgfm_fbuilder_formlist_filter',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						data_filter: tmp_params,
						opt_save: opt_save,
						opt_offset: $('#uifm_listform_offset_val').val(),
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						$('#zgfm-back-listform-maintable-container').html(msg['content']);

						$('.uiform-confirmation-func-action').click(function (e) {
							e.preventDefault(); 
							var targetUrl = $(this).attr('href'); 
							var tmp_callback = $(this).data('dialog-callback');
							$('#uiform-confirmation-func-action-dialog').dialog({
								autoOpen: false,
								title: 'Confirmation',
								modal: true,
								buttons: {
									OK: function () {
										$(this).dialog('close');
										eval(tmp_callback);
									},
									Cancel: function () {
										$(this).dialog('close');
									}
								}
							});

							$('#uiform-confirmation-func-action-dialog').dialog('option', 'title', $(this).data('dialog-title'));

							$('#uiform-confirmation-func-action-dialog').dialog('open');
						});
					}
				});
			};
		};
		window.zgfm_back_general = zgfm_back_general = $.zgfm_back_general = new zgfm_back_general();
	})($uifm, window);
}

if (typeof $uifm === 'undefined') {
	$uifm = jQuery;
}
var zgfm_back_helper = zgfm_back_helper || null;
if (!$uifm.isFunction(zgfm_back_helper)) {
	(function ($, window) {
		'use strict';

		var zgfm_back_helper = function () {
			var zgfm_variable = [];
			zgfm_variable.innerVars = {};
			zgfm_variable.externalVars = {};

			this.initialize = function () {};

			this.length_obj = function (obj) {
				var count = 0;
				for (var p in obj) {
					obj.hasOwnProperty(p) && count++;
				}
				return count;
			};

			this.generateUniqueID = function (nrodec) {
				var number = Math.random(); 
				number.toString(36); 
				var id = number.toString(36).substr(2, nrodec); 
				return id;
			};

			this.versionCompare = function (v1, v2, options) {

				var lexicographical = options && options.lexicographical,
					zeroExtend = options && options.zeroExtend,
					v1parts = v1.split('.'),
					v2parts = v2.split('.');

				function isValidPart(x) {
					return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
				}

				if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
					return NaN;
				}

				if (zeroExtend) {
					while (v1parts.length < v2parts.length) v1parts.push('0');
					while (v2parts.length < v1parts.length) v2parts.push('0');
				}

				if (!lexicographical) {
					v1parts = v1parts.map(Number);
					v2parts = v2parts.map(Number);
				}

				for (var i = 0; i < v1parts.length; ++i) {
					if (v2parts.length == i) {
						return 1;
					}

					if (v1parts[i] == v2parts[i]) {
						continue;
					} else if (v1parts[i] > v2parts[i]) {
						return 1;
					} else {
						return -1;
					}
				}

				if (v1parts.length != v2parts.length) {
					return -1;
				}

				return 0;
			};

			this.getData = function (mainarr, name) {
				return mainarr[name];
			};

			this.setData = function (mainarr, name, value) {
				mainarr[name] = value;
			};

			this.getData2 = function (mainarr, name, index) {
				try {
					return mainarr[name][index];
				} catch (err) {
					console.log('error getUiData2: ' + err.message);
				}
			};
			this.setData2 = function (mainarr, name, index, value) {
				if (!mainarr.hasOwnProperty(name)) {
					mainarr[name] = {};
				}
				if (!mainarr[name].hasOwnProperty(index)) {
					mainarr[name][index] = {};
				}
				mainarr[name][index] = value;
			};
			this.getData3 = function (mainarr, name, index, key) {
				try {
					return mainarr[name][index][key];
				} catch (err) {
					console.log('error getUiData3: ' + err.message);
				}
			};
			this.delData3 = function (mainarr, name, index, key) {
				delete mainarr[name][index][key];
			};

			this.setData3 = function (mainarr, name, index, key, value) {
				if (!mainarr.hasOwnProperty(name)) {
					mainarr[name] = {};
				}
				if (!mainarr[name].hasOwnProperty(index)) {
					mainarr[name][index] = {};
				}

				mainarr[name][index][key] = value;
			};
			this.setData4 = function (mainarr, name, index, key, option, value) {
				if (!mainarr.hasOwnProperty(name)) {
					mainarr[name] = {};
				}
				if (!mainarr[name].hasOwnProperty(index)) {
					mainarr[name][index] = {};
				}

				if (!mainarr[name][index].hasOwnProperty(key)) {
					mainarr[name][index][key] = {};
				}

				mainarr[name][index][key][option] = value;
			};
			this.getData4 = function (mainarr, name, index, key, option) {
				try {
					return mainarr[name][index][key][option];
				} catch (err) {
					console.log('error getUiData4: ' + err.message);
				}
			};
			this.getData5 = function (mainarr, name, index, key, section, option) {
				try {
					if (typeof mainarr[name][index] == 'undefined') {
						return '';
					} else {
						return mainarr[name][index][key][section][option];
					}
				} catch (err) {
					console.log('error getUiData5: ' + err.message);
					return '';
				}
			};
			this.setData5 = function (mainarr, name, index, key, section, option, value) {
				if (!mainarr.hasOwnProperty(name)) {
					mainarr[name] = {};
				}
				if (!mainarr[name].hasOwnProperty(index)) {
					mainarr[name][index] = {};
				}

				if (!mainarr[name][index].hasOwnProperty(key)) {
					mainarr[name][index][key] = {};
				}

				if (!mainarr[name][index][key].hasOwnProperty(section)) {
					mainarr[name][index][key][section] = {};
				}

				mainarr[name][index][key][section][option] = value;
			};
			this.addIndexData5 = function (mainarr, name, index, key, section, option, value) {
				if (typeof mainarr[name][index][key][section][option] == 'undefined') {
				} else {
					mainarr[name][index][key][section][option][value] = {};
				}
			};

			this.getData6 = function (mainarr, name, index, key, section, option, option2) {
				try {
					if (typeof mainarr[name][index][key][section][option][option2] == 'undefined') {
						return '';
					} else {
						return mainarr[name][index][key][section][option][option2];
					}
				} catch (err) {
					console.log('error handled - getUiData6: ' + err.message);
					return '';
				}
			};

			this.setData6 = function (mainarr, name, index, key, section, option, option2, value) {
				if (!mainarr.hasOwnProperty(name)) {
					mainarr[name] = {};
				}
				if (!mainarr[name].hasOwnProperty(index)) {
					mainarr[name][index] = {};
				}

				if (!mainarr[name][index].hasOwnProperty(key)) {
					mainarr[name][index][key] = {};
				}

				if (!mainarr[name][index][key].hasOwnProperty(section)) {
					mainarr[name][index][key][section] = {};
				}

				if (!mainarr[name][index][key][section].hasOwnProperty(option)) {
					mainarr[name][index][key][section][option] = {};
				}

				mainarr[name][index][key][section][option][option2] = value;
			};

			this.delData6 = function (mainarr, name, index, key, section, option, option2) {
				delete mainarr[name][index][key][section][option][option2];
			};
			this.tooltip_removeall = function () {
				if ($('body').find('.sfdc-tooltip').length && $('body').find('.sfdc-tooltip').data && $('body').find('.sfdc-tooltip').data('bs.tooltip')) {
					$('body').find('.sfdc-tooltip').tooltip('hide');
				}
			};
		};
		window.zgfm_back_helper = zgfm_back_helper = $.zgfm_back_helper = new zgfm_back_helper();
	})($uifm, window);
}

if (typeof $uifm === 'undefined') {
	$uifm = jQuery;
}
var zgfm_back_tools = zgfm_back_tools || null;
if (!$uifm.isFunction(zgfm_back_tools)) {
	(function ($, window) {
		'use strict';

		var zgfm_back_tools = function () {
			var zgfm_variable = [];
			zgfm_variable.innerVars = {};
			zgfm_variable.externalVars = {};

			this.initialize = function () {};
			this.setInnerVariable = function (name, value) {
				zgfm_variable.innerVars[name] = value;
			};
			this.getInnerVariable = function (name) {
				if (zgfm_variable.innerVars[name]) {
					return zgfm_variable.innerVars[name];
				} else {
					return '';
				}
			};


			this.pdf_showsample = function (type) {
				var editor, email_template_pdf_msg;
				var pdf_fullpage = $('#uifm_frm_main_pdf_htmlfullpage').bootstrapSwitchZgpb('state') ? 1 : 0;
				var form_id = $('#uifm_frm_main_id').val() ? $('#uifm_frm_main_id').val() : 0;

				zgfm_back_tools.setInnerVariable('form_id', form_id);
				switch (String(type)) {
					case 'pdf_email_attach':
						if (typeof tinymce != 'undefined') {
							editor = tinymce.get('uifm_frm_email_usr_tmpl_pdf');
							if (editor && editor instanceof tinymce.Editor) {
								email_template_pdf_msg = tinymce.get('uifm_frm_email_usr_tmpl_pdf').getContent();
							} else {
								email_template_pdf_msg = $('#uifm_frm_email_usr_tmpl_pdf').val() ? $('#uifm_frm_email_usr_tmpl_pdf').val() : '';
							}
						}
						break;
					case 'pdf_invoice_gen':
						if (typeof tinymce != 'undefined') {
							editor = tinymce.get('uifm_frm_invoice_tpl_content');
							if (editor && editor instanceof tinymce.Editor) {
								email_template_pdf_msg = tinymce.get('uifm_frm_invoice_tpl_content').getContent();
							} else {
								email_template_pdf_msg = $('#uifm_frm_invoice_tpl_content').val() ? $('#uifm_frm_invoice_tpl_content').val() : '';
							}
						}
						break;
					case 'pdf_record_gen':
						if (typeof tinymce != 'undefined') {
							editor = tinymce.get('uifm_frm_record_tpl_content');
							if (editor && editor instanceof tinymce.Editor) {
								email_template_pdf_msg = tinymce.get('uifm_frm_record_tpl_content').getContent();
							} else {
								email_template_pdf_msg = $('#uifm_frm_record_tpl_content').val() ? $('#uifm_frm_record_tpl_content').val() : '';
							}
						}
						break;
				}
				this.pdf_processSample(email_template_pdf_msg, pdf_fullpage);
			};

			this.pdf_processSample = function (message, whole_control) {
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_pdf_showsample',
					data: {
						action: 'rocket_fbuilder_pdf_showsample',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						full_page: whole_control,
						message: encodeURIComponent(message),
						csrf_field_name: uiform_vars.csrf_field_name,
						form_id: zgfm_back_tools.getInnerVariable('form_id')
					},
					success: function (msg) {
						try {
							if (parseInt(msg.status) === 1) {
								if (msg.pdf_name) {
									var a = document.createElement('a');

									if (typeof a.download === 'undefined') {
										window.location = msg.pdf_url;
									} else {
										a.href = msg.pdf_url;
										a.download = msg.pdf_name;
										document.body.appendChild(a);
										a.target = '_blank';
										a.click();
									}
								} else {
									window.location = msg.pdf_url;
								}
							} else {
								alert('Error! PDf was not generated');
							}
						} catch (ex) {
							alert('Error! PDf was not generated');
						}
					}
				});
			};

			this.email_sendsample = function (type) {
				var editor, email_template_msg;
				var html_wholecont = $('#uifm_frm_main_email_htmlfullpage').bootstrapSwitchZgpb('state') ? 1 : 0;
				var tmp_type;

				var email = $('#uifm_frm_from_email').val() || '';

				var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,8}$/;
				if (filter.test(email)) {
				} else {
					alert('Email address needed. Fill "From mail" option.');
					return false;
				}

				switch (String(type)) {
					case 'email_admin_tmpl':
						if (typeof tinymce != 'undefined') {
							editor = tinymce.get('uifm_frm_email_tmpl');
							if (editor && editor instanceof tinymce.Editor) {
								email_template_msg = tinymce.get('uifm_frm_email_tmpl').getContent();
							} else {
								email_template_msg = $('#uifm_frm_email_tmpl').val() ? $('#uifm_frm_email_tmpl').val() : '';
							}
						}
						tmp_type = 1;

						break;
					case 'email_client_tmpl':
						if (typeof tinymce != 'undefined') {
							editor = tinymce.get('uifm_frm_email_usr_tmpl');
							if (editor && editor instanceof tinymce.Editor) {
								email_template_msg = tinymce.get('uifm_frm_email_usr_tmpl').getContent();
							} else {
								email_template_msg = $('#uifm_frm_email_usr_tmpl').val() ? $('#uifm_frm_email_usr_tmpl').val() : '';
							}
						}

						tmp_type = 2;
						break;
				}

				this.email_processSample(email_template_msg, html_wholecont, email);
			};

			this.email_processSample = function (message, whole_control, email_to) {
				$.ajax({
					type: 'POST',
					url: rockfm_vars.uifm_siteurl + 'formbuilder/forms/ajax_email_sendsample',
					data: {
						action: 'rocket_fbuilder_email_sendsample',
						page: 'zgfm_form_builder',
						zgfm_security: uiform_vars.ajax_nonce,
						full_page: whole_control,
						message: encodeURIComponent(message),
						email_to: email_to,
						csrf_field_name: uiform_vars.csrf_field_name
					},
					success: function (msg) {
						if (parseInt(msg.st_error) === 0) {
							alert('Email test was sent to : ' + email_to);
						} else {
							alert('Error! Email test was not sent because of an error.');
						}
					}
				});
			};
		};
		window.zgfm_back_tools = zgfm_back_tools = $.zgfm_back_tools = new zgfm_back_tools();
	})($uifm, window);
}

if (typeof $uifm === 'undefined') {
	$uifm = jQuery;
}
var zgfm_back_upgrade = zgfm_back_upgrade || null;
if (!$uifm.isFunction(zgfm_back_upgrade)) {
	(function ($, window) {
		'use strict';

		var zgfm_back_upgrade = function () {
			var zgfm_variable = [];
			zgfm_variable.innerVars = {};
			zgfm_variable.externalVars = {};

			this.initialize = function () {
				let cur_core_arr = rocketform.getUiData('app_ver');

				switch (zgfm_back_helper.versionCompare(String(cur_core_arr), '3.4.1')) {
					case 1:
						break;
					case -1:
					case 0:
						this.upgrade_prev_3_4_1();
						break;
				}
			};

			this.upgrade_prev_3_4_1 = function () {};
		};
		window.zgfm_back_upgrade = zgfm_back_upgrade = $.zgfm_back_upgrade = new zgfm_back_upgrade();
	})($uifm, window);
}

(function ($) {
	var zgpbld_grid = function (element, options) {
		var elem = $(element);
		var obj = this;
		var drag = null;
		var ID = elem.attr('id');
		var t; 
		var M = Math;
		var cur_side = null;
		var defaults = {
			data: {}
		};
		var settings = $.extend(true, {}, defaults, options);
		this.publicMethod = function () {};

		this.events_trigger = function () {
		};

		this.drag_init = function (e) {
			try {
				var target = $(e.target).closest('.zgpb-fl-gs-block-style');

				var o = target.data(ID); 
				g = t.g[o.i]; 

				g.ox = e.pageX; 
				g.l = target.position().left; 

				$(e.target).closest('.zgpb-fl-gridsystem-opt').css('display', 'block');
				$(e.target).closest('.zgpb-fl-gridsystem').find('.zgpb-fl-gd-opt-icon-handler').removeCss('background', '#CEFBF8');
				$(e.target).closest('.zgpb-fl-gridsystem-opt').find('.zgpb-fl-gd-opt-icon-handler').css('background', '#CEFBF8');


				$(document)
					.bind('mousemove.' + ID, obj.drag_move)
					.bind('mouseup.' + ID, obj.drag_over); 
				$('head').append(
					"<style id='zgpb-grid-head-css' type='text/css'>*{cursor:e-resize!important;   -webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}</style>"
				); 
				drag = g;

				paint_variables();
			} catch (ex) {
				console.error(' error drag_init ', ex.message);
			}
		};

		this.drag_move = function (e) {
			try {
				if (!drag) return;
				var x = e.pageX - drag.ox + drag.l; 

				var i = drag.i; 

				drag.x = x;

				if (parseFloat(e.pageX) > parseFloat(drag.ox)) {
					syncCols(t, i, true);
				} else {
					syncCols(t, i, false);
				}


				paint_variables();

				return false; 
			} catch (ex) {
				console.error(' error drag_move ', ex.message);
			}
		};
		var syncCols = function (t, i, right) {
			try {
				var inc,
					possible_index = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
					w,
					box_min_width,
					temp_col2,
					c = t.c[i],
					c2 = t.c[i + 1];

				if (right === true) {
					inc = drag.x - drag.l;

					w = c.w + inc;
					var w2 = c2.w - inc; 

					box_min_width = (parseFloat(t.width()) * 8.333) / 100;
					temp_col2 = parseFloat(c.width()) + parseFloat(box_min_width) / 2;
				} else {
					inc = drag.l - drag.x;

					w = c.w - inc;
					var w2 = c2.w + inc; 

					box_min_width = (parseFloat(t.width()) * 8.333) / 100;
					temp_col2 = parseFloat(c2.width()) + parseFloat(box_min_width) / 2;
				}

				if (right === true) {
					if (parseFloat(w) > temp_col2) {
						var c_new_igrid = parseInt(c.cur_igrid) + 1;
						var c2_new_igrid = parseInt(c2.cur_igrid) - 1;

						if ($.inArray(c_new_igrid, possible_index) > -1 && $.inArray(c2_new_igrid, possible_index) > -1) {
							c.attr('class', 'zgpb-fl-gs-block-style sfdc-col-md-' + c_new_igrid);
							c2.attr('class', 'zgpb-fl-gs-block-style sfdc-col-md-' + c2_new_igrid);

							c.cur_igrid = parseInt(c.cur_igrid) + 1;
							c2.cur_igrid = parseInt(c2.cur_igrid) - 1;

							c.attr('data-zgpb-width', c.width());
							c2.attr('data-zgpb-width', c2.width());

							c.attr('data-zgpb-blockcol', c.cur_igrid);
							c2.attr('data-zgpb-blockcol', c2.cur_igrid);
						}
					}
				} else {
					if (parseFloat(w2) > temp_col2) {
						var c_new_igrid = parseInt(c.cur_igrid) - 1;
						var c2_new_igrid = parseInt(c2.cur_igrid) + 1;

						if ($.inArray(c_new_igrid, possible_index) > -1 && $.inArray(c2_new_igrid, possible_index) > -1) {
							c.attr('class', 'zgpb-fl-gs-block-style sfdc-col-md-' + c_new_igrid);
							c2.attr('class', 'zgpb-fl-gs-block-style sfdc-col-md-' + c2_new_igrid);

							c.cur_igrid = parseInt(c.cur_igrid) - 1;
							c2.cur_igrid = parseInt(c2.cur_igrid) + 1;

							c.attr('data-zgpb-width', c.width());
							c2.attr('data-zgpb-width', c2.width());

							c.attr('data-zgpb-blockcol', c.cur_igrid);
							c2.attr('data-zgpb-blockcol', c2.cur_igrid);
						}
					}
				}

			} catch (ex) {
				console.error(' error syncCols ', ex.message);
			}
		};

		this.drag_over = function (e) {
			try {
				$(document)
					.unbind('mousemove.' + ID)
					.unbind('mouseup.' + ID);
				$('#zgpb-grid-head-css').remove();

				drag = null;
				var c_tmp;

				$.each(t.c, function (index, element) {
					t.c[index].w = t.c[index].width();
				});

				$(e.target).closest('.zgpb-fl-gridsystem-opt').removeCss('display');
				$(e.target).closest('.zgpb-fl-gridsystem-opt').find('.zgpb-fl-gd-opt-icon-handler').removeCss('background', '#CEFBF8');

				paint_variables();
			} catch (ex) {
				console.error(' error drag_over ', ex.message);
			}
		};

		var paint_variables = function () {
			try {
				return;
				var output = '<ul>';
				$.each(t.c, function (index, element) {
					output += '<li>index: ' + index + ' <=> w: ' + t.c[index].w + '</li>';
				});
				output += '</ul>';
				$('#table-variables').html(output);
			} catch (ex) {
				console.error(' error drag_over ', ex.message);
			}
		};

		this.drag_cancel = function () {};

		this.onHover = function (e) {
			try {
				if (e) {
					e.stopPropagation();
					e.preventDefault();
				}
				var tmp_target_id = $(e.target).closest('.zgpb-field-template').attr('id');
				var tmp_target_type = $(e.target).closest('.zgpb-field-template').attr('data-typefield');

				switch (parseInt(tmp_target_type)) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:


						var tmp_tmpl = wp.template('zgpb-quick-options');
						if (parseInt($(this).find('.zgpb-fields-quick-options').length) === 0) {
							$(this).append(
								tmp_tmpl({
									type: tmp_target_type,
									id: tmp_target_id
								})
							);
						}
						break;
					default:
						var tmp_tmpl = wp.template('zgpb-quick-options');
						if (parseInt($(this).find('.zgpb-fields-quick-options').length) === 0) {
							$(this).append(
								tmp_tmpl({
									type: $('#' + ID).attr('data-typefield'),
									id: tmp_target_id
								})
							);
						}
						break;
				}


				var tmp_tmpl2 = wp.template('zgpb-field-hover-hlight');

				if (parseInt($(this).find('.zgpb-fields-hover-hlight-box').length) === 0) {
					$(this).append(tmp_tmpl2());
				}

				if (drag) return;

				if ($('#zgpb-editor-container').find('.zgpb-fl-gs-block-style-hover').length) {
					$('#zgpb-editor-container').find('.zgpb-fl-gs-block-style-hover').removeClass('zgpb-fl-gs-block-style-hover');
				}

				$(e.target).closest('.zgpb-fl-gs-block-style').addClass('zgpb-fl-gs-block-style-hover');
			} catch (ex) {
				console.error(' error onHover ', ex.message);
			}
		};

		this.offHover = function (e) {
			try {
				if (e) {
					e.stopPropagation();
					e.preventDefault();
				}

				if (parseInt($(this).find('.zgpb-fields-quick-options').length) > 0) {
					$(this).find('.zgpb-fields-quick-options').remove();
				}

				if (parseInt($(this).find('.zgpb-fields-hover-hlight-box').length) > 0) {
					$(this).find('.zgpb-fields-hover-hlight-box').remove();
				}

				if (drag) return;
				$(e.target).closest('.zgpb-fl-gs-block-style').removeClass('zgpb-fl-gs-block-style-hover');
			} catch (ex) {
				console.error(' error offHover ', ex.message);
			}
		};

		this.onWholeHover = function (e) {

			try {
				var tmp_tmpl = wp.template('zgpb-quick-options-2');
				if (parseInt($(this).find('.zgpb-fields-quick-options2').length) === 0) {
					$(this).append(
						tmp_tmpl({
							type: $('#' + ID).attr('data-typefield'),
							id: ID
						})
					);
				}
			} catch (ex) {
				console.error(' error offHover ', ex.message);
			}
		};

		this.offWholeHover = function (e) {
			try {
				if (parseInt($(this).find('.zgpb-fields-quick-options2').length) > 0) {
					$(this).find('.zgpb-fields-quick-options2').remove();
				}
			} catch (ex) {
				console.error(' error offWholeHover ', ex.message);
			}
		};

		this.init = function () {
			this.events_trigger();

			t = elem;
			t.g = [];
			t.c = [];
			t.w = t.width();

			createGrips();
		};

		var createGrips = function () {
			try {
				var cols = t.find(' .sfdc-row > .zgpb-fl-gs-block-style');

				t.cols = cols;
				t.ln = cols.length;


				cols.each(function (i) {
					var c = $(this);
					var g = $(this);
					g.t = t;
					g.i = i;
					g.c = c;
					g.w = g.width();

					c.w = c.width();
					c.blocks = c.attr('data-blocks'); 
					c.attr('data-zgpb-width', c.width());
					g.cur_igrid = g.attr('class').match(/\d+/)[0];
					c.cur_igrid = c.attr('class').match(/\d+/)[0];
					c.mpercent = c.attr('data-maxpercent');
					t.g.push(g);
					t.c.push(c);


					g.find('.zgpb-fl-gd-drag-line').mousedown(obj.drag_init).mouseup(obj.drag_cancel); 
					g.data(ID, { i: i, t: t.attr(ID) });

					$(this).on('mouseenter', obj.onHover);
					$(this).on('mouseleave', obj.offHover);
				});
			} catch (ex) {
				console.error(' error createGrips ', ex.message);
			}
		};

		this.init();
	};

	$.fn.zgpbld_grid = function (options) {
		return this.each(function () {
			var element = $(this);

			if (element.data('zgpbld_grid')) return;

			var myplugin = new zgpbld_grid(this, options);

			element.data('zgpbld_grid', myplugin);
		});
	};
})($uifm);

(function () {
	var __slice = [].slice;

	(function ($, window) {
		'use strict';
		var uiformDCheckbox;
		uiformDCheckbox = (function () {
			var uifm_dchkbox_var = [];
			uifm_dchkbox_var.innerVars = {};

			function uiformDCheckbox(element, options) {
				if (options == null) {
					options = {};
				}
				this.$element = $(element);
				this.options = $.extend(
					{},
					$.fn.uiformDCheckbox.defaults,
					{
						baseGalleryId: this.$element.data('gal-id'),
						opt_laymode: $(element).parent().attr('data-opt-laymode') || 1,
						opt_checked: this.$element.data('opt-checked'),
						opt_isradiobtn: this.$element.data('opt-isrdobtn'),
						opt_qtyMax: this.$element.data('opt-qtymax'),
						opt_qtySt: this.$element.data('opt-qtyst'),
						opt_price: this.$element.data('opt-price'),
						opt_label: this.$element.data('opt-label'),
						opt_thopt_showhvrtxt: $(element).parent().attr('data-thopt-showhvrtxt') || 0,
						opt_thopt_showcheckb: $(element).parent().attr('data-thopt-showcheckb') || 0,
						opt_thopt_zoom: $(element).parent().attr('data-thopt-zoom') || 0,
						opt_thopt_height: $(element).parent().attr('data-thopt-height') || 100,
						opt_thopt_width: $(element).parent().attr('data-thopt-width') || 100,
						backend: this.$element.data('backend'),
						baseClass: this.$element.data('base-class')
					},
					options
				);



				this.$element.find('.uifm-dcheckbox-item-viewport').attr('height', this.options.opt_thopt_height);
				this.$element.find('.uifm-dcheckbox-item-viewport').attr('width', this.options.opt_thopt_width);
				this.$opt_gal_btn_show = this.$element.find('.uifm-dcheckbox-item-showgallery');

				this.$opt_gal_links_a = this.$element.find('.uifm-dcheckbox-item-gal-imgs a');

				this.$opt_gal_box = this.$element.find('.uifm-dcheckbox-item-viewport');

				this.$opt_gal_next_img = this.$element.find('.uifm-dcheckbox-item-nextimg');
				this.$opt_gal_prev_img = this.$element.find('.uifm-dcheckbox-item-previmg');

				var tmp_imglist = this.$element.find('.uifm-dcheckbox-item-gal-imgs a img');
				if (parseInt(tmp_imglist.length) < 2) {
					this.$opt_gal_next_img.removeClass('uifm-dcheckbox-item-nextimg').hide();
					this.$opt_gal_prev_img.removeClass('uifm-dcheckbox-item-previmg').hide();
				}

				this.$opt_gal_checkbox = this.$element.find('.uifm-dcheckbox-item-chkst');
				this.$inp_checkbox = this.$element.find('.uifm-dcheckbox-item-chkval');
				this.$inp_checkbox_max = this.$element.find('.uifm-dcheckbox-item-qty-num');
				this.$spinner_wrapper = this.$element.find('.uifm-dcheckbox-item-qty-wrap') || null;

				this.$spinner_buttons = this.$element.find('.uifm-dcheckbox-item-qty-wrap button') || null;

				this.$element.on(
					'init.uiformDCheckbox',
					(function (_this) {
						return function () {
							return _this.options.onInit.apply(element, arguments);
						};
					})(this)
				);

				if (parseInt(this.options.backend) === 1) {
					this.$canvas_parent=this.$element.closest('.uifm-input17-wrap').width();
				}else{
					this.$canvas_parent=this.$element.closest('.rockfm-input17-wrap').width();
				}

				if (parseInt(this.options.opt_laymode) === 2) {
					this._mod2_initPreview();
				} else {
					if (parseInt(this.options.opt_thopt_zoom) === 0) {
						this.$element.find('.uifm-dcheckbox-item-showgallery').hide();
					} else {
						this.$element.find('.uifm-dcheckbox-item-showgallery').show();
					}
				}

				switch (parseInt(this.options.opt_thopt_showhvrtxt)) {
					case 1:
						this.$element.tooltip();
						break;
					case 0:
					case 2:
					case 3:
						this.$element.find('.uifm-dcheckbox-item-showgallery').hide();
						break;
				}

				if (parseInt(this.options.opt_thopt_showcheckb) === 0) {
					this.$opt_gal_checkbox.hide();
				} else {
					this.$opt_gal_checkbox.show();
				}

				this.$element.on(
					'switchChange.uiformDCheckbox',
					(function (_this) {
						return function () {
							return _this.options.onSwitchChange.apply(element, arguments);
						};
					})(this)
				);


				if (parseInt(this.options.backend) === 0) {
					this._elementHandlers();
					this._handleHandlers();
				}
				this._elementHandlers2();

				this._galleryHandlers();


				this._get_items();
				this._refresh();
			};

			uiformDCheckbox.prototype._constructor = uiformDCheckbox;

			uiformDCheckbox.prototype._refresh = function () {
				this.$canvas_parent=this.$element.closest('.rockfm-input17-wrap').width();
				this._enableCheckboxVal(this.$opt_gal_checkbox, this);
				this._setValToChkBoxInput(this);
				this._get_items();
			};

			uiformDCheckbox.prototype._mod2_initPreview = function () {
				this.$element.find('.uifm-dcheckbox-item-nextimg').hide();
				this.$element.find('.uifm-dcheckbox-item-previmg').hide();
				this.$element.find('.uifm-dcheckbox-item-showgallery').hide();

				if (parseInt(this.options.opt_checked) === 0) {
					this._mode2_get_img(this.$element, 2);
				} else {
					this._mode2_get_img(this.$element, 0);
				}
			};

			uiformDCheckbox.prototype._get_items = function () {
				var _this = this;
				if (this.$element.length) {
					var tmp_num_elems = this.$element;
					tmp_num_elems.each(function (i) {
						if (parseInt(_this.options.opt_laymode) === 2) {
							if (parseInt(_this.options.opt_checked) === 1) {
								_this._mode2_get_img(_this.$element, 0);
							} else {
								_this._mode2_get_img(_this.$element, 2);
							}
						} else {
							_this._getImageToCanvas($(this), 0, _this);
						}
					});
				}
			};

			uiformDCheckbox.prototype._getImageToCanvas = function (obj, opt, _this) {
				var ctx = obj.find('canvas')[0].getContext('2d');
				var tmp_can_width = parseInt(this.options.opt_thopt_width);
				var tmp_can_height = parseInt(this.options.opt_thopt_height);

				var aspectRatio=tmp_can_width/tmp_can_height;

				var closestParentDiv=this.$canvas_parent;

				 				var new_width, new_height;
				if(tmp_can_width > closestParentDiv){

					if(parseInt(closestParentDiv)>0){
						new_width = closestParentDiv;
					}else{
						new_width = tmp_can_width;
					}
					new_height = new_width/aspectRatio;
				}else{
					new_width = tmp_can_width;
					new_height = tmp_can_height;
				}


												var img = new Image();
				img.onload = function () {
					ctx.drawImage(img, 0, 0, new_width, new_height);
				};
				var getImgIndex = obj.find('canvas').attr('data-uifm-nro');
				switch (parseInt(opt)) {
					case 1:
						img.src = _this._getPrevImageGallery(obj, getImgIndex);
						break;
					case 2:
						img.src = _this._getNextImageGallery(obj, getImgIndex);
						break;
					default:
					case 0:
						img.src = _this._getImageGallery(obj, getImgIndex);
						break;
				}

				this.$element.find('.uifm-dcheckbox-item-viewport').attr('height', new_height);
				this.$element.find('.uifm-dcheckbox-item-viewport').attr('width', new_width);
			};

			uiformDCheckbox.prototype._getImageGallery = function (obj, _index) {
				var objimgs = obj.find('.uifm-dcheckbox-item-gal-imgs a img');
				var objcanvas = obj.find('canvas');
				if (objimgs.eq(_index).length) {
					objcanvas.attr('data-uifm-nro', _index);
					return objimgs.eq(_index).attr('src');
				} else {
					objcanvas.attr('data-uifm-nro', 0);
					return objimgs.eq(0).attr('src');
				}
			};

			uiformDCheckbox.prototype._getPrevImageGallery = function (obj, _index) {
				var objimgs = obj.find('.uifm-dcheckbox-item-gal-imgs a img');
				var objcanvas = obj.find('canvas');
				var newIndex = parseInt(_index) - 1;
				if (objimgs.eq(newIndex).length) {
					objcanvas.attr('data-uifm-nro', newIndex);
					return objimgs.eq(newIndex).attr('src');
				} else {
					objcanvas.attr('data-uifm-nro', 0);
					return objimgs.eq(0).attr('src');
				}
			};

			uiformDCheckbox.prototype._mode2_get_img = function (obj, _index) {
				var ctx = obj.find('canvas')[0].getContext('2d');
				var tmp_can_width = parseInt(this.options.opt_thopt_width);
				var tmp_can_height = parseInt(this.options.opt_thopt_height);

				var aspectRatio=tmp_can_width/tmp_can_height;

				var closestParentDiv=this.$canvas_parent;

				 				var new_width, new_height;
				if(tmp_can_width > closestParentDiv){
					new_width = closestParentDiv;
					new_height = new_width/aspectRatio;
				}else{
					new_width = tmp_can_width;
					new_height = tmp_can_height;
				}

								var img = new Image();
				img.onload = function () {
					ctx.drawImage(img, 0, 0, new_width, new_height);
				};

				var objimgs = obj.find('.uifm-dcheckbox-item-gal-imgs a img');
				var objcanvas = obj.find('canvas');
				var newIndex = parseInt(_index);
				if (objimgs.eq(newIndex).length) {
					objcanvas.attr('data-uifm-nro', newIndex);
					img.src = objimgs.eq(newIndex).attr('src');
				} else {
					objcanvas.attr('data-uifm-nro', 0);
					img.src = objimgs.eq(0).attr('src');
				}

				this.$element.find('.uifm-dcheckbox-item-viewport').attr('height', new_height);
				this.$element.find('.uifm-dcheckbox-item-viewport').attr('width', new_width);
			};

			uiformDCheckbox.prototype._getNextImageGallery = function (obj, _index) {
				var objimgs = obj.find('.uifm-dcheckbox-item-gal-imgs a img');
				var objcanvas = obj.find('canvas');
				var newIndex = parseInt(_index) + 1;
				if (objimgs.eq(newIndex).length) {
					objcanvas.attr('data-uifm-nro', newIndex);
					return objimgs.eq(newIndex).attr('src');
				} else {
					objcanvas.attr('data-uifm-nro', 0);
					return objimgs.eq(0).attr('src');
				}
			};

			uiformDCheckbox.prototype._setInnerVariable = function (name, value) {
				uifm_dchkbox_var.innerVars[name] = value;
			};
			uiformDCheckbox.prototype._getInnerVariable = function (name) {
				if (uifm_dchkbox_var.innerVars[name]) {
					return uifm_dchkbox_var.innerVars[name];
				} else {
					return '';
				}
			};
			uiformDCheckbox.prototype.optChecked = function (value) {
				if (typeof value === 'undefined') {
					return this.options.opt_checked;
				}
				this.options.opt_checked = value;
				return this.$element;
			};
			uiformDCheckbox.prototype.man_optChecked = function (value) {
				this.optChecked(value);
				this._enableCheckboxVal(this.$opt_gal_checkbox, this);
				this._setValToChkBoxInput(this);
				return this.$element;
			};

			uiformDCheckbox.prototype.man_mod2_refresh = function () {
				this._mod2_initPreview();
			};

			uiformDCheckbox.prototype.optQtySt = function (value) {
				if (typeof value === 'undefined') {
					return this.options.opt_qtySt;
				}
				this.options.opt_qtySt = value;
				return this.$element;
			};
			uiformDCheckbox.prototype.man_optQtySt = function (value) {
				this.optQtySt(value);
				if (value && parseInt(this.options.opt_checked)) {
					this.$spinner_wrapper.show();
				} else {
					this.$spinner_wrapper.hide();
				}
				return this.$element;
			};
			uiformDCheckbox.prototype.refreshImgs = function () {
				if (parseInt(this.options.opt_laymode) === 2) {
					this._mod2_initPreview();
				} else {
					this._getImageToCanvas(this.$element, 0, this);
				}
				return this.$element;
			};
			uiformDCheckbox.prototype.optQtyMax = function (value) {
				if (typeof value === 'undefined') {
					return this.options.opt_qtyMax;
				}
				this.options.opt_qtyMax = value;
				return this.$element;
			};
			uiformDCheckbox.prototype.man_optQtyMax = function (value) {
				this.optQtyMax(value);
				this.$inp_checkbox_max.val(value);

				return this.$element;
			};
			uiformDCheckbox.prototype.onInit = function (value) {
				if (typeof value === 'undefined') {
					return this.options.onInit;
				}
				if (!value) {
					value = $.fn.uiformDCheckbox.defaults.onInit;
				}
				this.options.onInit = value;
				return this.$element;
			};

			uiformDCheckbox.prototype.onSwitchChange = function (value) {
				if (typeof value === 'undefined') {
					return this.options.onSwitchChange;
				}
				if (!value) {
					value = $.fn.uiformDCheckbox.defaults.onSwitchChange;
				}

				this.options.onSwitchChange = value;
				return this.$element;
			};

			uiformDCheckbox.prototype.get_totalCost = function () {
				var total;
				var input_spinner = this.$element.find('.uifm-dcheckbox-item-qty-num');
				total = parseFloat(input_spinner.val()) * parseFloat(this.options.opt_price);
				return total;
			};
			uiformDCheckbox.prototype.get_labelOpt = function () {
				return this.options.opt_label;
			};
			uiformDCheckbox.prototype.onCostCalcProcess = function () {
				var obj_form = this.$element.closest('.rockfm-form');
				rocketfm.costest_fillSticky(obj_form);

				return this.$element;
			};

			uiformDCheckbox.prototype.destroy = function () {
				var $form;
				$form = this.$element.closest('form');
				if ($form.length) {
					$form.off('reset.uiformDCheckbox').removeData('uifm-dynamic-checkbox');
				}
				this.$container.children().not(this.$element).remove();
				this.$element.unwrap().unwrap().off('.uiformDCheckbox').removeData('uifm-dynamic-checkbox');
				return this.$element;
			};

			uiformDCheckbox.prototype._elementHandlers = function () {
				return this.$element.on({
					'change.uiformDCheckbox': (function (_this) {
						return function (e, checked) {
							e.preventDefault();
							e.stopImmediatePropagation();

							return _this.$element;
						};
					})(this),
					'hover.uiformDCheckbox': (function (_this) {
						return function (e) {
							e.preventDefault();
						};
					})(this),
					'focus.uiformDCheckbox': (function (_this) {
						return function (e) {
							e.preventDefault();
						};
					})(this),
					'blur.uiformDCheckbox': (function (_this) {
						return function (e) {
							e.preventDefault();
						};
					})(this),
					'keydown.uiformDCheckbox': (function (_this) {})(this)
				});
			};

			uiformDCheckbox.prototype._elementHandlers2 = function () {
				return this.$element.on({
					'mouseover.uiformDCheckbox': (function (_this) {
						return function (e) {
							e.preventDefault();

							if (parseInt(_this.options.opt_laymode) === 2) {
								if (parseInt(_this.options.opt_checked) === 0) {
									_this._mode2_get_img(_this.$element, 1);
								}
							}
						};
					})(this),
					'mouseout.uiformDCheckbox': (function (_this) {
						return function (e) {
							e.preventDefault();

							if (parseInt(_this.options.opt_laymode) === 2) {
								if (parseInt(_this.options.opt_checked) === 1) {
									_this._mode2_get_img(_this.$element, 0);
								} else {
									_this._mode2_get_img(_this.$element, 2);
								}
							}
						};
					})(this)
				});
			};

			uiformDCheckbox.prototype._galleryHandlers = function () {
				this.$opt_gal_next_img.on(
					'click.uiformDCheckbox',
					(function (_this) {
						return function (e) {
							e.preventDefault();
							if (parseInt(_this.options.opt_isradiobtn) === 1) {
								_this._getImageToCanvas($(this).closest('.uifm-dradiobtn-item'), 2, _this);
							} else {
								_this._getImageToCanvas($(this).closest('.uifm-dcheckbox-item'), 2, _this);
							}
						};
					})(this)
				);

				this.$opt_gal_prev_img.on(
					'click.uiformDCheckbox',
					(function (_this) {
						return function (e) {
							e.preventDefault();
							if (parseInt(_this.options.opt_isradiobtn) === 1) {
								_this._getImageToCanvas($(this).closest('.uifm-dradiobtn-item'), 1, _this);
							} else {
								_this._getImageToCanvas($(this).closest('.uifm-dcheckbox-item'), 1, _this);
							}
						};
					})(this)
				);
			};

			uiformDCheckbox.prototype._handleHandlers = function () {
				this.$opt_gal_btn_show.on(
					'click.uiformDCheckbox',
					(function (_this) {
						return function (e) {
							e.preventDefault();

							var borderless = true;

							$('#' + _this.options.baseGalleryId).data('useBootstrapModal', !borderless);
							$('#' + _this.options.baseGalleryId).data('container', '#' + _this.options.baseGalleryId);
							$('#' + _this.options.baseGalleryId).toggleClass('blueimp-gallery-controls', borderless);

							var tmp_blueimpgal;
							try {
								tmp_blueimpgal = blueimp.Gallery;
							} catch (err) {
								tmp_blueimpgal = window.blueimpgal;
							}

							tmp_blueimpgal(_this.$opt_gal_links_a, $('#' + _this.options.baseGalleryId).data());
						};
					})(this)
				);

				this.$opt_gal_checkbox.on(
					'click.uiformDCheckbox',
					(function (_this) {
						return function (e) {
							e.preventDefault();

							if (parseInt(_this.options.opt_isradiobtn) === 1) {
								var tmp_index = $(this).closest('.uifm-dradiobtn-item').attr('data-inp17-opt-index');
								var tmp_container = $(this).closest('.rockfm-input17-wrap');
								var tmp_radiobtn_items = tmp_container.find('.uifm-dradiobtn-item');

								var tmp_item_index;
								tmp_radiobtn_items.each(function (i) {
									tmp_item_index = $(this).attr('data-inp17-opt-index');

									if (parseInt(tmp_item_index) === parseInt(tmp_index)) {
										$(this).uiformDCheckbox('man_optChecked', 1);
									} else {
										$(this).uiformDCheckbox('man_optChecked', 0);
									}

									if (parseInt(_this.options.opt_laymode) === 2) {
										$(this).uiformDCheckbox('man_mod2_refresh');
									}
								});
							} else {
								_this._gen_optChecked(this, _this);
								_this._enableCheckboxVal(this, _this);
								_this._setValToChkBoxInput(_this);
							}

							return _this.$element.trigger('change.uiformDCheckbox');
						};
					})(this)
				);

				this.$opt_gal_box.on(
					'click.uiformDCheckbox',
					(function (_this) {
						return function (e) {
							e.preventDefault();

							if (parseInt(_this.options.opt_isradiobtn) === 1) {
								var tmp_index = $(this).closest('.uifm-dradiobtn-item').attr('data-inp17-opt-index');
								var tmp_container = $(this).closest('.rockfm-input17-wrap');
								var tmp_radiobtn_items = tmp_container.find('.uifm-dradiobtn-item');

								var tmp_item_index;
								tmp_radiobtn_items.each(function (i) {
									tmp_item_index = $(this).attr('data-inp17-opt-index');

									if (parseInt(tmp_item_index) === parseInt(tmp_index)) {
										$(this).uiformDCheckbox('man_optChecked', 1);
									} else {
										$(this).uiformDCheckbox('man_optChecked', 0);
									}
									if (parseInt(_this.options.opt_laymode) === 2) {
										$(this).uiformDCheckbox('man_mod2_refresh');
									}
								});
							} else {
								_this._gen_optChecked(_this.$opt_gal_checkbox, _this);
								_this._enableCheckboxVal(_this.$opt_gal_checkbox, _this);
								_this._setValToChkBoxInput(_this);
							}

							return _this.$element.trigger('change.uiformDCheckbox');
						};
					})(this)
				);

				this.$inp_checkbox_max.on(
					'keyup',
					(function (_this) {
						return function (e) {
							e.preventDefault();
							_this._setValToChkBoxInput(_this);
							return _this.$element.trigger('change.uiformDCheckbox');
						};
					})(this)
				);

				this.$spinner_buttons.on(
					'click.uiformDCheckbox',
					(function (_this) {
						return function (e) {
							e.preventDefault();
							_this._spinnerCounter(this, _this);
							_this._setValToChkBoxInput(_this);
							return _this.$element.trigger('change.uiformDCheckbox');
						};
					})(this)
				);

			};

			uiformDCheckbox.prototype._spinnerCounter = function (el, _this) {
				var objbtn = $(el);
				var input_spinner = _this.$element.find('.uifm-dcheckbox-item-qty-num');
				if (_this.$element.find('.uifm-dcheckbox-item-qty-wrap button').hasClass('dcheckbox-disabled')) {
					_this.$element.find('.uifm-dcheckbox-item-qty-wrap button').removeClass('dcheckbox-disabled');
				}

				if (objbtn.attr('data-value') == 'increase') {
					if (input_spinner.attr('data-max') == undefined || parseInt(input_spinner.val()) < parseInt(input_spinner.attr('data-max'))) {
						input_spinner.val(parseInt(input_spinner.val()) + 1);
						if (parseInt(input_spinner.val()) === parseInt(input_spinner.attr('data-max'))) {
							objbtn.addClass('dcheckbox-disabled');
						}
					} else {
						objbtn.addClass('dcheckbox-disabled');
					}
				} else {
					if (input_spinner.attr('data-min') == undefined || parseInt(input_spinner.val()) > parseInt(input_spinner.attr('data-min'))) {
						input_spinner.val(parseInt(input_spinner.val()) - 1);
						if (parseInt(input_spinner.val()) === parseInt(input_spinner.attr('data-min'))) {
							objbtn.addClass('dcheckbox-disabled');
						}
					} else {
						objbtn.addClass('dcheckbox-disabled');
					}
				}
			};
			uiformDCheckbox.prototype._gen_optChecked = function (el, _this) {
				var objbtn = $(el);
				if (objbtn.hasClass('uifm-dcheckbox-checked')) {
					_this.optChecked(0);
				} else {
					_this.optChecked(1);
				}
			};
			uiformDCheckbox.prototype._setValToChkBoxInput = function (_this) {
				_this.$inp_checkbox.val(_this.$inp_checkbox_max.val());
			};
			uiformDCheckbox.prototype._enableCheckboxVal = function (el, _this) {
				var objbtn = $(el);
				if (parseInt(this.options.opt_checked) === 0) {
					if (parseInt(this.options.opt_isradiobtn) === 1) {
						objbtn.removeClass('uifm-dcheckbox-checked').html('<i class="fa fa-circle-o"></i>');
					} else {
						objbtn.removeClass('uifm-dcheckbox-checked').html('<i class="fa fa-square-o"></i>');
					}
					_this.$inp_checkbox.prop('checked', false);
					if (_this.$spinner_wrapper && parseInt(_this.options.opt_qtySt) === 1) {
						_this.$spinner_wrapper.hide();
					}
				} else {
					if (parseInt(this.options.opt_isradiobtn) === 1) {
						objbtn.addClass('uifm-dcheckbox-checked').html('<i class="fa fa-check-circle-o"></i>');
					} else {
						objbtn.addClass('uifm-dcheckbox-checked').html('<i class="fa fa-check-square-o"></i>');
					}
					_this.$inp_checkbox.prop('checked', true);
					if (_this.$spinner_wrapper && parseInt(_this.options.opt_qtySt) === 1) {
						_this.$spinner_wrapper.show();
					}
				}
			};

			uiformDCheckbox.prototype._getClasses = function (classes) {
				var c, cls, _i, _len;
				if (!$.isArray(classes)) {
					return ['' + this.options.baseClass + '-' + classes];
				}
				cls = [];
				for (_i = 0, _len = classes.length; _i < _len; _i++) {
					c = classes[_i];
					cls.push('' + this.options.baseClass + '-' + c);
				}
				return cls;
			};

			return uiformDCheckbox;
		})();
		$.fn.uiformDCheckbox = function () {
			var args, option, ret;
			(option = arguments[0]), (args = 2 <= arguments.length ? __slice.call(arguments, 1) : []);
			ret = this;
			this.each(function () {
				var $this, data;
				$this = $(this);
				data = $this.data('uifm-dynamic-checkbox');
				if (!data) {
					$this.data('uifm-dynamic-checkbox', (data = new uiformDCheckbox(this, option)));
				}
				if (typeof option === 'string') {
					return (ret = data[option].apply(data, args));
				}
			});
			return ret;
		};
		$.fn.uiformDCheckbox.Constructor = uiformDCheckbox;
		return ($.fn.uiformDCheckbox.defaults = {
			backend: '1',
			opt_isradiobtn: '0',
			baseClass: 'uifm-dynamic-checkbox',
			onInit: function () {},
			onSwitchChange: function () {}
		});
	})(window.$uifm, window);
}.call(this));

$uifm(document).ready(function ($) {
	$.fn.removeCss = function () {
		var removedCss = $.makeArray(arguments);
		return this.each(function () {
			var e$ = $(this);
			var style = e$.attr('style');
			if (typeof style !== 'string') return;
			style = $.trim(style);
			var styles = style.split(/;+/);
			var sl = styles.length;
			for (var l = removedCss.length, i = 0; i < l; i++) {
				var r = removedCss[i];
				if (!r) continue;
				for (var j = 0; j < sl; ) {
					var sp = $.trim(styles[j]);
					if (!sp || (sp.indexOf(r) === 0 && $.trim(sp.substring(r.length)).indexOf(':') === 0)) {
						styles.splice(j, 1);
						sl--;
					} else {
						j++;
					}
				}
			}
			if (styles.length === 0) {
				e$.removeAttr('style');
			} else {
				e$.attr('style', styles.join(';'));
			}
		});
	};
});

window.wp = window.wp || {};
(function ($) {
	wp.template = _.memoize(function (id) {
		var compiled,
			options = {
				evaluate: /<#([\s\S]+?)#>/g,
				interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
				escape: /\{\{([^\}]+?)\}\}(?!\})/g,
				variable: 'data'
			};

		return function (data) {
			compiled = compiled || _.template($('#tmpl-' + id).html(), options);
			return compiled(data);
		};
	});
})($uifm);

$uifm(document).ready(function ($) {


   $('input,textarea').attr('autocomplete', 'off');
        $('#zgfm_edit_panel').disableAutoFill({
         passwordField: '.password'}
     );


    String.prototype.cleanup = function() {
       return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
    };


        var setfield_tab_active;


    	        $('.uiform-editing-main').ColumnToggle();

        $('.uiform-builder-data a[data-toggle="sfdc-tab"]').on('shown.bs.sfdc-tab', function (e) {
            e.preventDefault();
        var target = $(e.target).attr("href");
        });

              function testAnim(target,x,duration) {
        $(target).addClass(x + ' animated '+duration).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(target).removeClass(x + ' animated '+duration);
        });
        }  
     $('[data-toggle="tooltip"]').tooltip({container: "body"});  

     $('.uifm-custom-color').colorpicker(); 

      $("#uifm_frm_wiz_theme_typ").on("change", function(e) {
            var f_val=$(e.target).val();
            rocketform.wizardtab_changeTheme(f_val);
        });






    $(".chzn-select").chosen({width: "100%",search_contains: true}); 



       $(".uifm_main_spinner_1").TouchSpin({
        verticalbuttons: true,
       min: 0,
        max: 200,
        stepinterval: 1,
        verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
        verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
    });



    $(".tooltip-option-enable input").tooltip({
        title : 'Enable',
        container: "body"
    });
    $(".tooltip-val-demo").tooltip({
        title : 'Validator text',
        container: "body"
    });


    $(".autogrow").autogrow();
    $(".wp-media-buttons").find('#insert-media-button').siblings().hide();

        $( "#uifm-close-setting-tab" ).on( "click", function() {
    rocketform.closeSettingTab();
    });

        $(document).on( "click", "a.uiform-fields-qopt-select", function(e) {
        var tmp_input=$(this).find('input');
        var id_field=tmp_input.closest('.uiform-field').attr('id');
        if(e.target.tagName != "INPUT") {
            if(tmp_input.is(':checked')){
                tmp_input.prop( "checked",false);
            }else{
                tmp_input.prop( "checked",true);
            }
        } else {

                    }
        rocketform.fieldQuickOptions_selectField(id_field);
    });




    $(document).on( "change keyup focus keypress", ".uifm_frm_skin_tab_title_evt", function(e) {
        var tabnro = $(e.target).closest('.uifm_frm_skin_tab_content').data('tab-nro');
        rocketform.wizardtab_changeTabTitle(tabnro);
    });


    var uifm_obj_txtarea_editors = [ 
                             $('#uifm_frm_summbox_skintxt_txt')

                                                         ];


             $(document).on( "keyup focus", uifm_obj_txtarea_editors, function(e) {
        rocketform.captureEventTinyMCE2(e);
    });

    $(document).on( "change keyup focus keypress", ".uifm-f-option", function(e) {
      var pickfield = $(e.target).closest('.uiform-field');
        var f_step = $(e.target).closest('.uiform-step-pane').data('uifm-step');
        var store=$( this ).data('field-store');
        var f_store=store.split("-");
        var f_sec=f_store[0];
        var f_opt=f_store[1];
        var f_val=$( this ).val();
        var f_id=pickfield.attr("id");

               rocketform.setDataOptToCoreData(f_step,f_id,store,f_val);
        var idselected= $('#uifm-field-selected-id').val();
         if(f_id===idselected){
           var tabobject=$('#uifm-field-selected-id').parent();
            rocketform.setDataOptToSetTab(tabobject,store,f_val);
         }


             });

    $(document).on( "change keyup focus keypress", "#uifm-popup-setfname", function(e) {
        var f_val=$( this ).val();
        $('#uifm_frm_main_title').val(f_val);
    });


           $('.uiform-opt-slider').bootstrapSlider();
     $(".uifm_frm_form_skin_spinner").on("change", function(e) {
            var store=$(e.target).data('form-store');
            var f_store=store.split("-");
            var f_sec=f_store[0];
            var f_opt=f_store[1];
            var f_val=$(e.target).val();
            rocketform.setUiData3('skin',f_sec,f_opt,f_val);
            var obj_field= $('.uiform-preview-base');
            if(obj_field){
            rocketform.setDataOptToPrevForm(obj_field,'skin',f_sec+'-'+f_opt,f_val);
            }   
        });

         $(".uifm_frm_form_skin_spinner").TouchSpin({
        verticalbuttons: true,
        min: 0,
        max: 10000,
        stepinterval: 1,
        verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
        verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
    });

         $(".uifm_frm_form_skin_spinner").TouchSpin({
        verticalbuttons: true,
        min: 0,
        max: 10000,
        stepinterval: 1,
        verticalupclass: 'sfdc-glyphicon sfdc-glyphicon-plus',
        verticaldownclass: 'sfdc-glyphicon sfdc-glyphicon-minus'
    });

    $(document).on( "change", ".uifm-formskin-setoption-st", function(e) {
        var store=$( this ).data('form-store');
        var f_store=store.split("-");
        var f_sec=f_store[0];
        var f_opt=f_store[1];
        var f_val=$( this ).filter(':checked').val();
        f_val=(f_val)?f_val:0;
        rocketform.setUiData3('skin',f_sec,f_opt,f_val);
        var obj_field= $('.uiform-preview-base');
         if(obj_field){
         rocketform.setDataOptToPrevForm(obj_field,f_sec+'-'+f_opt,f_val);
         }
    });


    $(document).on( "click", ".uifm-fmskin-setoption-btn", function(e) {
        var store=$( this ).data('form-store');
        var f_store=store.split("-");
        var f_sec=f_store[0];
        var f_opt=f_store[1];
        var f_val=$( this ).find('input').val();
        rocketform.setUiData3('skin',f_sec,f_opt,f_val);

        rocketform.setDataOptToSetFormTab($('#uiform-build-form-tab'),'skin',f_sec+'-'+f_opt,f_val);

                 var obj_field= $('.uiform-preview-base');
         if(obj_field){
         rocketform.setDataOptToPrevForm(obj_field,'skin',f_sec+'-'+f_opt,f_val);

                  }
    });

    $('#uiform-set-form-wizard .uifm-custom-color').colorpicker().on('changeColor', function(ev){
       rocketform.wizardtab_saveChangesToMdata();
       rocketform.wizardtab_refreshPreview();
    });


    $('#uiform-settings-tab3-2,#uiform-settings-tab3-4').find('.uifm-custom-color').colorpicker().on('changeColor', function(ev){

               var store=$( this ).data('form-store');
        var main_sec=$( this ).data('form-msec');
        var f_store=store.split("-");
        var f_sec=f_store[0];
        var f_opt=f_store[1];
        var f_val=$(this).find('input').val();
        if(f_val){
            rocketform.setUiData3(main_sec,f_sec,f_opt,f_val);
            var obj_field= $('.uiform-preview-base');
            if(obj_field){
            rocketform.setDataOptToPrevForm(obj_field,main_sec,f_sec+'-'+f_opt,f_val);

                         } 
        }
    });



    $('#uifm_frm_main_ajaxmode').on('switchChange.bootstrapSwitchZgpb', function(event, state) {
        var f_val=(state)?1:0;
       rocketform.setUiData2('main','submit_ajax',f_val);
    });

   $('.uifm_frm_skin_bgst_event').on('switchChange.bootstrapSwitchZgpb', function(event, state) {
       rocketform.loadForm_tab_skin_updateBG();
    });
    $('.uifm_frm_skin_bgcolor_event').colorpicker().on('changeColor', function(ev){
      rocketform.loadForm_tab_skin_updateBG();
    });
    $('.uifm_frm_wiz_st_event').on('switchChange.bootstrapSwitchZgpb', function(event, state) {
            rocketform.guidedtour_showTextOnPreviewPane(false);
       rocketform.wizardtab_enableStatus();
    });


    $('#uiform-settings-tab3-2 .switch-field,#uiform-settings-tab3-4 .switch-field').on('switchChange.bootstrapSwitchZgpb', function(event, state) {
        var store=$( this ).data('form-store');
        var main_sec=$( this ).data('form-msec');
        var f_store=store.split("-");
        var f_sec=f_store[0];
        var f_opt=f_store[1];
        var f_val=(state)?1:0;
        switch(main_sec){
            case 'skin':
                rocketform.setUiData3(main_sec,f_sec,f_opt,f_val);
                break;
            case 'summbox':
                rocketform.setUiData3(main_sec,f_sec,f_opt,f_val);
                break;
        }

                var obj_field= $('.uiform-preview-base');
         if(obj_field){
         rocketform.setDataOptToPrevForm(obj_field,main_sec,f_sec+'-'+f_opt,f_val);
         }
    });

    $('.switch-field').bootstrapSwitchZgpb();


    $("#uiform-settings-tab3-2  .uiform-opt-slider").on('slide', function(slideEvt) {
        var store=$( this ).data('form-store');
        var main_sec=$( this ).data('form-msec');
        var f_store=store.split("-");
        var f_sec=f_store[0];
        var f_opt=f_store[1];
        var f_val=slideEvt.value;
        rocketform.setUiData3(main_sec,f_sec,f_opt,f_val);
        var obj_field= $('.uiform-preview-base');
         if(obj_field){
         rocketform.setDataOptToPrevForm(obj_field,main_sec,f_sec+'-'+f_opt,f_val);
         }
    });

    $("#uiform-set-form-summbox  .uiform-opt-slider").on('slide', function(slideEvt) {
        var store=$( this ).data('form-store');
        var main_sec=$( this ).data('form-msec');
        var f_store=store.split("-");
        var f_sec=f_store[0];
        var f_opt=f_store[1];
        var f_val=slideEvt.value;
        rocketform.setUiData3(main_sec,f_sec,f_opt,f_val);
        var obj_field= $('.uiform-preview-base');
         if(obj_field){
         rocketform.setDataOptToPrevForm(obj_field,main_sec,f_sec+'-'+f_opt,f_val);
         }
    });


    $('.unknown ul.dropdown-menu.selectpicker li').on('click', function () {
      var obj_option=$(this).parent().parent().parent().parent().find('select');
            var selectedValue = $($(obj_option).find('option')[parseInt($(this).index())]).val();
            var store=obj_option.data('field-store');
            var f_store=store.split("-");
                var f_sec=f_store[0];
                var f_opt=f_store[1];
            var f_id= $('#uifm-field-selected-id').val();
      var f_step;
      var field_Checked=$('.uiform-main-form .uiform-fields-qopt-select input:checked');
      if(parseInt(field_Checked.length)>1){
             obj_field= field_Checked.closest('.uiform-field');
             $.each(obj_field, function(index2, value2) {
                f_id=$(this).attr('id');
                f_step=$('#'+f_id).closest('.uiform-step-pane').data('uifm-step');
                rocketform.setDataOptToCoreData(f_step,f_id,store,selectedValue);
                if($(this)){
                rocketform.setDataOptToPrevField($(this),store,selectedValue);
                } 
             });

                    }else{
            f_step=$('#'+f_id).closest('.uiform-step-pane').data('uifm-step');
            rocketform.setDataOptToCoreData(f_step,f_id,store,selectedValue);
            var obj_field= $('#'+f_id);
                if(obj_field){
                rocketform.setDataOptToPrevField(obj_field,store,selectedValue);
                }
        }
    });






    $('#uifm_frm_skin_fmbg_type_1').on('click', function () {
        $('#uifm_frm_skin_fmbg_color_1').closest('.row').show();
        $('#uifm_frm_skin_fmbg_color_2').closest('.row').hide();
        $('#uifm_frm_skin_fmbg_color_3').closest('.row').hide();
    });
    $('#uifm_frm_skin_fmbg_type_2').on('click', function () {
        $('#uifm_frm_skin_fmbg_color_1').closest('.row').hide();
        $('#uifm_frm_skin_fmbg_color_2').closest('.row').show();
        $('#uifm_frm_skin_fmbg_color_3').closest('.row').show();
    });

    $('#uifm_frm_inp18_fmbg_type_1').on('click', function () {
        $('#uifm_frm_inp18_fmbg_color_1').closest('.row').show();
        $('#uifm_frm_inp18_fmbg_color_2').closest('.row').hide();
        $('#uifm_frm_inp18_fmbg_color_3').closest('.row').hide();
    });
    $('#uifm_frm_inp18_fmbg_type_2').on('click', function () {
        $('#uifm_frm_inp18_fmbg_color_1').closest('.row').hide();
        $('#uifm_frm_inp18_fmbg_color_2').closest('.row').show();
        $('#uifm_frm_inp18_fmbg_color_3').closest('.row').show();
    });






                         $('.uiform-set-options-tabs ul.sfdc-nav-tabs').on('shown.bs.sfdc-tab', function (e) {
        setfield_tab_active = $(e.target).data('uifm-title'); 
        rocketform.setInnerVariable('setfield_tab_active',setfield_tab_active);
        rocketform.previewfield_hidePopOver();

        rocketform.previewfield_helpblock_hidetooltip();

                })

          $('.uiformc-menu-wrap ul.sfdc-nav-tabs a[data-toggle="sfdc-tab"],.uiform-set-options-tabs ul.sfdc-nav-tabs a[data-toggle="sfdc-tab"]').on('shown.bs.sfdc-tab', function (e) {
        if(!$(e.target).hasClass('uifm-tab-fld-validation')){
            $('.sfdc-popover').popover('hide');

                     }

                })

        $('.uiformc-menu-wrap ul.sfdc-nav-tabs a[data-toggle="sfdc-tab"],.uiform-set-options-tabs ul.sfdc-nav-tabs a[data-toggle="sfdc-tab"]').on('shown.bs.sfdc-tab', function (e) {
        setfield_tab_active = $(e.target).data('uifm-title'); 

                 if(String(setfield_tab_active)==='helpb'){
             rocketform.setInnerVariable('setfield_tab_active',setfield_tab_active);

                          var id=$('#uifm-field-selected-id').val();
             rocketform.previewfield_elementTextarea($('#'+id),"help_block");

                      }else{
             zgfm_back_helper.tooltip_removeall();
         }

                   });

    var formfield;
	$('#uifm_frm_skin_bg_btnadd').click(function() {


                                   rocketform.elfinder_showPopUp({
                                windowURL:uiform_vars.url_elfinder2,
                                windowName:'_blank',
                                height:490,
                                width:950,
                                centerScreen:1,
                                location:0
                            });

                                        formfield = $('#uifm_frm_skin_bg_imgurl').attr('id');

                        window.processFile = function(file) { 
                        $('#'+ formfield).val(file.url);
                        $('#uifm_frm_skin_bg_srcimg_wrap').html('<img class="sfdc-img-thumbnail" src="' + file.url + '" />');
                        rocketform.loadForm_tab_skin_updateBG();
                    }

            	    return false;
	});

      rocketform.wizardtab_tabManageEvt(); 



       $('.uiform-wrap a[data-toggle="sfdc-tab"]').on('shown.bs.sfdc-tab', function (e) {
           rocketform.previewfield_hideAllPopOver();

                  });
       $('.uiform-wrap .uiform-settings-invoice').on('shown.bs.sfdc-tab', function (e) {
           rocketform.invoiceoptions_genListToIntMem();

            }); 

       $('.uiform-wrap .zgfm_gsettings_additional').on('shown.bs.sfdc-tab', function (e) {

                   var cminst = $('#uifm_frm_main_addjs').data('CodeMirrorInstance');  
             cminst.refresh();
         cminst = $('#uifm_frm_main_addcss').data('CodeMirrorInstance');  
             cminst.refresh();  

                   });

       $('#uifm_frm_email_usr_recipient').on('change', function (e) {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            rocketform.setUiData2('onsubm','mail_recipient',valueSelected);
        });
       $('.uifm_frm_inv_to_text_src').on('change', function (e) {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            var nro = $(this).attr('data-uifm-nro');
            rocketform.setUiData2('invoice','to_text'+nro,valueSelected);
        });

        $("#uiform-clogicgraph").dialog({
            autoOpen: false, 
            height: 800,
            scrollable: true,
            width: 800,
            show: {
                effect: "blind",
                duration: 1000
            },
            hide: {
                effect: "explode",
                duration: 1000
            },buttons: { "OK": function() { $(this).dialog("close"); }}
        });

        $("#uiform-clogicgraph").dialog({
            autoOpen: false, 
            height: 800,
            scrollable: true,
            width: 800,
            show: {
                effect: "blind",
                duration: 1000
            },
            hide: {
                effect: "explode",
                duration: 1000
            },buttons: { "OK": function() { $(this).dialog("close"); }}
        });

    $(".uiform-confirmation-func-action").click(function (e) {
        e.preventDefault(); 
        var targetUrl = $(this).attr("href"); 
        var tmp_callback =$(this).data('dialog-callback'); 
        $("#uiform-confirmation-func-action-dialog").dialog({
            autoOpen: false,
            title: 'Confirmation',
            modal: true,
            buttons: {
                "OK" : function () {
                   $(this).dialog("close");
                   eval(tmp_callback);

                                   },
                "Cancel" : function () {
                    $(this).dialog("close");
                }
            }
        });

        $("#uiform-confirmation-func-action-dialog").dialog('option', 'title', $(this).data('dialog-title'));

        $("#uiform-confirmation-func-action-dialog").dialog("open");
    });

   rocketform.backend_init_load();
});

jQuery(function($){
    $.fn.removeCss = function() {
  var removedCss = $.makeArray(arguments);
  return this.each(function() {
    var e$ = $(this);
    var style = e$.attr('style');
    if (typeof style !== 'string') return;
    style = $.trim(style);
    var styles = style.split(/;+/);
    var sl = styles.length;
    for (var l = removedCss.length, i = 0; i < l; i++) {
      var r = removedCss[i];
      if (!r) continue;
      for (var j = 0; j < sl;) {
        var sp = $.trim(styles[j]);
        if (!sp || (sp.indexOf(r) === 0 && $.trim(sp.substring(r.length)).indexOf(':') === 0)) {
          styles.splice(j, 1);
          sl--;
        } else {
          j++;
        }
      }
    }
    if (styles.length === 0) {
      e$.removeAttr('style');
    } else {
      e$.attr('style', styles.join(';'));
    }
  });
};


          rocketform.initPanel();




                         });


function uiformUpdateFontSelect(id,val){
    jQuery(function($){

                var objsel=$('#'+id);
        if(objsel.data('stylesFontMenu')){
           objsel.data('stylesFontMenu').uifm_load_font(val);
        objsel.data('selected',val);
        objsel.chosen().val(val);
        objsel.chosen().trigger("chosen:updated"); 
        }

            });
}

function uiformRefreshFontMenu(){

               jQuery('#uiform-build-field-tab select.sfm').stylesFontMenu();

}


function zgfm_input17_onChangeLayout(){
    jQuery(function($){
        var f_val=$('#uifm_fld_inp17_thopt_mode').val();
        rocketform.input17settings_showOptionbyLayMode(f_val);
        var store = "input17-thopt_mode";
         var f_id= $('#uifm-field-selected-id').val();
         var f_step=$('#'+f_id).closest('.uiform-step-pane').data('uifm-step');

                 rocketform.setDataOptToCoreData(f_step,f_id,store,f_val);

                var tabobject=$('#uifm-field-selected-id').parent();
        rocketform.setDataOptToSetTab(tabobject,store,f_val);
        rocketform.input17settings_tabeditor_generateAllOptions();
       rocketform.input17settings_preview_genAllOptions($('#'+f_id),'input17');


                   });
}

function uifm_loadScript(url,id, callback) {

        var script = document.createElement("script")
        script.type = "text/javascript";
        script.id = id;
        script.async = false;
        if (script.readyState) { 
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { 
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);  
    }

function uifm_stripHTML(dirtyString){

        var html = dirtyString;
var div = document.createElement("div");
div.innerHTML = html;
    return div.innerText;

}
function uifm_validate_field(arr1,arr2){

        var arr3={},arr3_2;

        for (var name in arr1) {
        if (arr1.hasOwnProperty(name)) {
            arr3_2={}
            for (var name2 in arr1[name]) {
                if(arr1[name].hasOwnProperty(name2)  && arr2[name].hasOwnProperty(name2)){
                     arr3_2[name2] = arr1[name][name2];
                }
            }
            arr3[name] = arr3_2;
        }else{

                   }
    }

    return arr3;
}