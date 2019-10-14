
if(typeof($uifm)==='undefined'){$uifm=jQuery;}
var rocketfm=rocketfm||null;if(!$uifm.isFunction(rocketfm)){(function($,window){window.rocketfm=rocketfm=$.rocketfm=function(){var uifmvariable=[];uifmvariable.innerVars={};uifmvariable.externalVars={};var cur_form_obj=null;var validators={letters:{regex:/^[A-Za-z][A-Za-z\s]*$/},numbers:{regex:/^(\s*\d+)+\s*$/},numletter:{regex:/^[A-Za-z0-9-.,:;\s][A-Za-z0-9\s-.,:;]*$/},postcode:{regex:/^.{3,}$/},email:{regex:/^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,8}$/},phone:{regex:/^[2-9]\d{2}-\d{3}-\d{4}$/}};arguments.callee.setAccounting=function(obj){};arguments.callee.initialize=function(){this.setExternalVars({});};arguments.callee.setExternalVars=function(_uifmvar){uifmvariable.externalVars["fm_ids"]=_uifmvar.fm_ids||[];uifmvariable.externalVars["fm_loadmode"]=_uifmvar.fm_loadmode||"";uifmvariable.externalVars["is_demo"]=_uifmvar.is_demo||0;};arguments.callee.getExternalVars=function(name){if(uifmvariable.externalVars[name]){return uifmvariable.externalVars[name];}else{return'';}};arguments.callee.setInnerVariable=function(name,value){uifmvariable.innerVars[name]=value;};arguments.callee.setInnerVariable_byform=function(idform,name,value){if(typeof uifmvariable.innerVars['var_form'+idform]=='undefined'){uifmvariable.innerVars['var_form'+idform]={};}
uifmvariable.innerVars['var_form'+idform][name]=value;};arguments.callee.getInnerVariable=function(name){if(uifmvariable.innerVars[name]){return uifmvariable.innerVars[name];}else{return'';}};arguments.callee.getInnerVariable_byform=function(idform,name){if(uifmvariable.innerVars['var_form'+idform]){return uifmvariable.innerVars['var_form'+idform][name];}else{return'';}};arguments.callee.dumpvar3=function(object){return JSON.stringify(object,null,2);};arguments.callee.dumpvar2=function(object){return JSON.stringify(object);};arguments.callee.dumpvar=function(object){var seen=[]
var json=JSON.stringify(object,function(key,val){if(val!=null&&typeof val=="object"){if(seen.indexOf(val)>=0)
return
seen.push(val)}
return val});return seen;};arguments.callee.showLogMessage=function(msg){console.log(msg);};arguments.callee.validate_processValidation=function(value,type_val){var isValid=false;if(value.length){switch(parseInt(type_val)){case 1:if(value.length&&validators['letters'].regex.test(value)){isValid=true;}
break;case 2:if(value.length&&validators['numletter'].regex.test(value)){isValid=true;}
break;case 3:if(value.length&&validators['numbers'].regex.test(value)){isValid=true;}
break;case 4:value=$.trim(value);if(value.length&&validators['email'].regex.test(value)){isValid=true;}
break;case 5:default:if(value.length){isValid=true;}
break;}}
return isValid;};arguments.callee.validate_applyPopOverOpt=function(element){var tmp_cur_fm_obj=this.getInnerVariable('cur_form_obj')||"body";var cus_placement;switch(parseInt($(element).data('val-pos'))){case 1:cus_placement='right';break;case 2:cus_placement='bottom';break;case 3:cus_placement='left';break;case 0:default:cus_placement='top';break;}
var options={animation:false,html:true,placement:cus_placement,content:$(element).data('val-custxt')||'Ops... this is required',trigger:'manual',container:tmp_cur_fm_obj};return options;};arguments.callee.validate_addInvalidFields=function(value){var temp;temp=this.getInnerVariable('val_invalid_fields');temp.push(value);this.setInnerVariable('val_invalid_fields',temp);};arguments.callee.validate_field=function(el){var field_id,field_type,field_value,val_type,val_custtext,val_pos,val_tip,val_tip_col,val_tip_bg,field_pop;field_id=el.attr('id');field_type=el.attr('data-typefield');val_type=el.data('val-type')||0;val_pos=el.data('val-pos');val_tip=el.data('tip_col');val_tip_col=el.data('tip_col');val_tip_bg=el.data('tip_bg');this.setInnerVariable('cur_form_obj',el.closest('.rockfm-form'));var tmp_theme_type;var tempvar;var searchInput;switch(parseInt(field_type)){case 6:case 7:case 15:case 28:case 29:case 30:field_value=el.find('.rockfm-txtbox-inp-val').val();field_pop=el.find('.rockfm-txtbox-inp-val');if(this.validate_processValidation(field_value,val_type)){el.removeClass('rockfm-required');field_pop.removeClass('rockfm-val-error');field_pop.popover('destroy');}else{el.addClass('rockfm-required');if(!field_pop.hasClass("rockfm-val-error")){field_pop.addClass('rockfm-val-error');}
field_pop.popover('destroy').popover(this.validate_applyPopOverOpt(el)).popover('show');}
break;case 8:case 9:case 10:case 11:case 12:case 13:case 23:case 24:case 25:case 26:case 43:switch(parseInt(field_type)){case 8:tmp_theme_type=el.find('.rockfm-input2-wrap').attr('data-theme-type');switch(parseInt(tmp_theme_type)){case 1:tempvar=el.find('.rockfm-inp2-rdo');searchInput=tempvar.map(function(index){if($(this).parent().hasClass('checked')){return $(this).val();}else{return null;}}).toArray();break;default:tempvar=el.find('.rockfm-inp2-rdo');searchInput=tempvar.map(function(index){if($(this).is(':checked')){return $(this).val();}else{return null;}}).toArray();break;}
if(searchInput[0]){field_value='1';}else{field_value='';}
field_pop=el.find('.rockfm-input2-wrap');break;case 9:tmp_theme_type=el.find('.rockfm-input2-wrap').attr('data-theme-type');switch(parseInt(tmp_theme_type)){case 1:tempvar=el.find('.rockfm-inp2-chk');searchInput=tempvar.map(function(index){if($(this).parent().hasClass('checked')){return $(this).val();}else{return null;}}).toArray();break;default:tempvar=el.find('.rockfm-inp2-chk');searchInput=tempvar.map(function(index){if($(this).is(':checked')){return $(this).val();}else{return null;}}).toArray();break;}
if(searchInput[0]){field_value='1';}else{field_value='';}
field_pop=el.find('.rockfm-input2-wrap');break;case 10:if(el.find(".rockfm-input2-wrap select option:selected").val().length>0){field_value='1';}else{field_value='';}
field_pop=el.find('.rockfm-input2-wrap');break;case 11:if(el.find(".rockfm-input2-wrap select option:selected").length>0){field_value='1';}else{field_value='';}
field_pop=el.find('.rockfm-input2-wrap');break;case 12:if(el.find(".rockfm-fileupload-wrap .fileinput-filename").html().length>0){field_value='1';}else{field_value='';}
field_pop=el.find('.rockfm-fileupload-wrap');break;case 13:if(el.find(".rockfm-fileupload-wrap .fileinput-preview").html().length>0){field_value='1';}else{field_value='';}
field_pop=el.find('.rockfm-fileupload-wrap .fileinput-preview');break;case 23:field_value=el.find('.rockfm-colorpicker-wrap input').val();field_pop=el.find('.rockfm-colorpicker-wrap');break;case 24:field_value=el.find('.rockfm-input7-datepic input').val();field_pop=el.find('.rockfm-input7-datepic');break;case 25:field_value=el.find('.rockfm-input7-timepic input').val();field_pop=el.find('.rockfm-input7-timepic');break;case 26:field_value=el.find('.rockfm-input7-datetimepic input').val();field_pop=el.find('.rockfm-input7-datetimepic');break;case 43:field_value=el.find('.flatpickr-input').val();field_pop=el.find('.uifm-input-flatpickr');break;}
if(this.validate_processValidation(field_value,val_type)){el.removeClass('rockfm-required');field_pop.removeClass('rockfm-val-error');field_pop.popover('destroy');}else{el.addClass('rockfm-required');if(!field_pop.hasClass("rockfm-val-error")){field_pop.addClass('rockfm-val-error');}
field_pop.popover('destroy').popover(this.validate_applyPopOverOpt(el)).popover('show');}
break;case 0:break;default:}};arguments.callee.validate_enableHighlight=function(el){try{var first_el=el.find('.rockfm-required').not(".rockfm-conditional-hidden").eq(0);var type=first_el.attr('data-typefield');var field_inp;switch(parseInt(type)){case 6:case 15:case 28:case 29:case 30:field_inp=first_el.find('.rockfm-txtbox-inp-val');field_inp.focus();break;case 7:field_inp=first_el.find('.rockfm-txtbox-inp-val');field_inp.focus();break;case 8:case 9:case 10:case 11:field_inp=first_el.find('.rockfm-input2-wrap');break;case 12:field_inp=first_el.find('.rockfm-fileupload-wrap');break;case 13:field_inp=first_el.find('.rockfm-fileupload-wrap');break;case 23:field_inp=first_el.find('.rockfm-colorpicker-wrap');break;case 24:field_inp=first_el.find('.rockfm-input7-datepic');break;case 25:field_inp=first_el.find('.rockfm-input7-timepic');break;case 26:field_inp=first_el.find('.rockfm-input7-datetimepic');break;case 43:field_inp=first_el.find('.uifm-input-flatpickr');break;case 0:break;default:}
var tmp_top;tmp_top=parseFloat(field_inp.first().offset().top)-100;if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.scrollTo(0,tmp_top);}}else{$('html,body').animate({scrollTop:tmp_top},'slow');}}
catch(ex){console.error("validate_enableHighlight : ",ex.message+' - '+type);}};arguments.callee.validate_form=function(el_form){var el,valid;cur_form_obj=el_form;el_form.find('.rockfm-required').not(".rockfm-conditional-hidden").on("click change keyup focus keypress",function(){rocketfm.validate_field($(this));});el_form.find('.rockfm-required').not(".rockfm-conditional-hidden").each(function(index,element){rocketfm.validate_field($(element));});el_form.find('.rockfm-required').not(".rockfm-conditional-hidden").find('.rockfm-colorpicker-wrap').colorpicker().on('changeColor',function(ev){var tmp_fld=$(this).closest('.rockfm-field');rocketfm.validate_field(tmp_fld);});if(parseInt(el_form.find('.rockfm-required').not(".rockfm-conditional-hidden").length)>0){valid=false;this.validate_enableHighlight(el_form);}else{valid=true;}
return{isValid:valid,error:''}};arguments.callee.submitForm_showMessage=function(el,response,obj_btn){var msg_error='<div class="alert alert-danger"><i class="fa fa-exclamation-triangle"></i> Error! Form was not submitted.</div>';var form_id=el.parent().find('._rockfm_form_id').val();var msg='';var tmp_msg=el.parent().find(".rockfm-alert-container");tmp_msg.html('');var tmp_redirect_st=0;var tmp_redirect_url='';if(response){var arrJson=JSON&&JSON.parse(response)||$.parseJSON(response);if(parseInt(arrJson.success)===1){if(parseInt(arrJson.sm_redirect_st)===1){tmp_redirect_st=1;tmp_redirect_url=decodeURIComponent(arrJson.sm_redirect_url);}else{msg=decodeURIComponent(arrJson.show_message);el.hide();}
try{if(parseInt($('.g-recaptcha').length)>0){delete zgfm_recaptcha_elems['recaptcha_'+form_id];$.each(zgfm_recaptcha_elems,function(index,value){grecaptcha.reset(zgfm_recaptcha_elems[index]);});}}
catch(err){}}else{msg=decodeURIComponent(arrJson.form_error_msg)||msg_error;}}else{msg=msg_error;}
if(tmp_redirect_st===1){rocketfm.redirect_tourl(tmp_redirect_url);return false;}else{if(msg){var tmp_msg=el.parent().find(".rockfm-alert-container");tmp_msg.html('');tmp_msg.append('<div class="rockfm-alert-inner" >'+msg+'</div>');tmp_msg.show();if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.size();parentIFrame.scrollTo(0,tmp_msg.offset().top);}}else{$('html,body').animate({scrollTop:tmp_msg.offset().top},'slow');}}
$('.popover').popover('hide');if($('.uiform-main-form [data-toggle="tooltip"]').length){$('.uiform-main-form [data-toggle="tooltip"]').tooltip('destroy');}
obj_btn.removeAttr("disabled").html(obj_btn.attr('data-val-btn'));}
$(document).trigger('zgfm.form.after_submit',{});};arguments.callee.submitForm_submit=function(el){if(el.find('._rockfm_type_submit')&&parseInt(el.find('._rockfm_type_submit').val())===1){var obj_btn=el.find('.rockfm-submitbtn .rockfm-txtbox-inp-val');if(el.find('.rockfm-fileupload-wrap').length){var options={url:rockfm_vars.uifm_siteurl+"uiformbuilder/ajax_submit_ajaxmode",beforeSend:function()
{},type:'POST',beforeSubmit:function(formData,formObject,formOptions){formData.push({name:'zgfm_security',value:rockfm_vars.ajax_nonce});formData.push({name:'zgfm_is_demo',value:uifmvariable.externalVars["is_demo"]});},beforeSerialize:function(form,options){el.find('.uifm-conditional-hidden',form).remove();obj_btn.attr('disabled','disabled').html(obj_btn.attr('data-val-subm')+' <i class="sfdc-glyphicon sfdc-glyphicon-refresh sfdc-gly-spin"></i>');},uploadProgress:function(event,position,total,percentComplete)
{},success:function()
{},complete:function(response)
{obj_btn.removeAttr('disabled');rocketfm.submitForm_showMessage(el,response.responseText,obj_btn);},error:function()
{console.log('errors');}};el.ajaxForm(options);el.submit();}else{var data=el.uifm_serialize();$.ajax({type:"post",url:rockfm_vars.uifm_siteurl+"uiformbuilder/ajax_submit_ajaxmode",data:data+'&zgfm_is_demo='+uifmvariable.externalVars["is_demo"]+'&zgfm_security='+rockfm_vars.ajax_nonce,async:true,dataType:"html",beforeSend:function(){obj_btn.attr('disabled','disabled').html(obj_btn.attr('data-val-subm')+' <i class="sfdc-glyphicon sfdc-glyphicon-refresh sfdc-gly-spin"></i>');},success:function(response){obj_btn.removeAttr('disabled');rocketfm.submitForm_showMessage(el,response,obj_btn);}});}}else{el.find('.rockfm-conditional-hidden').remove();el.submit();}};arguments.callee.captcha_validate=function(){var el_form=this.getInnerVariable('val_curform_obj');var captcha_obj=$(el_form).find('.rockfm-inp6-captcha');var el_field=captcha_obj.closest('.rockfm-field');var obj_btn=$(el_form).find('.rockfm-submitbtn .rockfm-txtbox-inp-val');$.ajax({type:'POST',url:rockfm_vars.uifm_siteurl+"uiformbuilder/ajax_validate_captcha",dataType:"json",data:{'action':'rocket_front_valcaptcha','zgfm_security':rockfm_vars.ajax_nonce,'rockfm-code':el_field.find('.rockfm-inp6-captcha-code').val(),'rockfm-inpcode':el_field.find('.rockfm-inp6-captcha-inputcode').val()},beforeSend:function(){rocketfm.submit_changeModbutton(el_form,true);},success:function(response){try{rocketfm.submit_changeModbutton(el_form,false);if(typeof response=='object')
{if(response.success===true){rocketfm.captcha_response(true);}else{rocketfm.captcha_response(false);}}else{rocketfm.captcha_response(false);}}
catch(ex){rocketfm.captcha_response(false);}}});};arguments.callee.captcha_response=function(success){var temp=this.getInnerVariable('val_curform_obj');if(success===true){rocketfm.submitForm_submit(temp);}else{var tmp_captcha=$(temp).find('.rockfm-inp6-captcha-inputcode');var hidePopover=function(){tmp_captcha.popover('hide');};tmp_captcha.popover('destroy').popover(rocketfm.validate_applyPopOverOpt(tmp_captcha)).focus(hidePopover).popover('show');if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.scrollTo(0,tmp_captcha.offset().top-40);}}else{$('html,body').animate({scrollTop:tmp_captcha.offset().top-40},'slow');}}};arguments.callee.submit_changeModbutton=function(form_obj,load){var obj_btn,obj_btn2;if(parseInt($(form_obj).find('.rockfm-submitbtn .rockfm-txtbox-inp-val').length)>0){obj_btn=$(form_obj).find('.rockfm-submitbtn .rockfm-txtbox-inp-val');if(load===true){obj_btn.attr('disabled','disabled').html(obj_btn.attr('data-val-subm')+' <i class="sfdc-glyphicon sfdc-glyphicon-refresh gly-spin"></i>');}else{obj_btn.removeAttr('disabled').html(obj_btn.attr('data-val-btn'));}}else if(parseInt($(form_obj).find('.rockfm-wizardbtn .rockfm-btn-wiznext').length)>0){obj_btn=$(form_obj).find('.rockfm-wizardbtn .rockfm-btn-wizprev');obj_btn2=$(form_obj).find('.rockfm-wizardbtn .rockfm-btn-wiznext');var tab_cur_index=form_obj.find('.uiform-steps li.uifm-current').index();var tab_next_obj=form_obj.find('.uiform-steps li.uifm-current').next();var tab_next_index=tab_next_obj.index();var tmp_lbl;if(parseFloat(tab_cur_index)<parseFloat(tab_next_index)){tmp_lbl=obj_btn2.attr('data-value-next');}else{tmp_lbl=obj_btn2.attr('data-value-last');}
if(load===true){obj_btn.attr('disabled','disabled');obj_btn2.attr('disabled','disabled').find('.rockfm-inp-lbl').html(tmp_lbl+' <i class="sfdc-glyphicon sfdc-glyphicon-refresh gly-spin"></i>');}else{obj_btn.removeAttr('disabled');obj_btn2.removeAttr('disabled').find('.rockfm-inp-lbl').html(tmp_lbl);}}else{}};arguments.callee.recaptcha_validate=function(){var form_obj=this.getInnerVariable('val_curform_obj');var field_id=form_obj.find('.g-recaptcha').closest('.rockfm-recaptcha').attr('data-idfield');var form_id=this.getInnerVariable('submitting_form_id');var response=grecaptcha.getResponse(zgfm_recaptcha_elems['recaptcha_'+form_id]);$.ajax({type:'POST',url:rockfm_vars.uifm_siteurl+"uiformbuilder/ajax_check_recaptcha",dataType:"json",data:{'action':'rocket_front_checkrecaptcha','zgfm_security':rockfm_vars.ajax_nonce,'rockfm-uid-field':field_id,'rockfm-code-recaptcha':response,'form_id':form_obj.find('._rockfm_form_id').val()},beforeSend:function(){rocketfm.submit_changeModbutton(form_obj,true);},success:function(response){try{rocketfm.submit_changeModbutton(form_obj,false);if(typeof response=='object')
{if(response.success===true){rocketfm.recaptcha_response(true);}else{rocketfm.recaptcha_response(false);}}else{rocketfm.recaptcha_response(false);}}
catch(ex){rocketfm.recaptcha_response(false);}},error:function(jqXHR,textStatus,errorThrown){rocketfm.recaptcha_response(false);}});};arguments.callee.captcha_refreshImage=function(element){var el=$(element);var el_data=el.data('rkver');var el_url=el.data('rkurl');var obj_field=el.closest('.rockfm-field');$.ajax({type:'POST',url:rockfm_vars.uifm_siteurl+"uiformbuilder/ajax_refresh_captcha",dataType:"json",data:{'action':'rocket_front_refreshcaptcha','zgfm_security':rockfm_vars.ajax_nonce,'rkver':el_data},success:function(response){obj_field.find('.rockfm-inp6-captcha-img').attr('src',el_url+response.rkver);el.attr('data-rkver',response.rkver);obj_field.find('.rockfm-inp6-captcha-code').val(response.code);}});};arguments.callee.recaptcha_response=function(success){var temp=this.getInnerVariable('val_curform_obj');if(success===true){rocketfm.submitForm_submit(temp);}else{var tmp_captcha=$(temp).find('.rockfm-input5-wrap');var hidePopover=function(){tmp_captcha.popover('hide');};tmp_captcha.popover('destroy').popover(rocketfm.validate_applyPopOverOpt(tmp_captcha)).focus(hidePopover).popover('show');if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.scrollTo(0,tmp_captcha.offset().top-40);}}else{$('html,body').animate({scrollTop:tmp_captcha.offset().top-40},'slow');}}};arguments.callee.loadform_init=function(){var obj_form_list=$('.rockfm-form-container');var obj_form;obj_form_list.each(function(i){obj_form=$(this).find('.rockfm-form');if(!obj_form.hasClass('rockfm-form-mloaded')){obj_form.addClass('rockfm-form-mloaded');if(obj_form.find('.rockfm-input4-slider').length){obj_form.find('.rockfm-input4-slider').slider();obj_form.find('.rockfm-input4-slider').on("slide",function(slideEvt){$(this).parent().parent().find('.rockfm-input4-number').text(slideEvt.value);});}
if(obj_form.find('.rockfm-input4-spinner').length){var spinners=obj_form.find('.rockfm-input4-spinner'),s_min,s_max,s_step,s_value;spinners.each(function(i){s_min=$(this).attr('data-rockfm-min'),s_max=$(this).attr('data-rockfm-max'),s_step=$(this).attr('data-rockfm-step'),s_value=$(this).attr('data-rockfm-value');$(this).TouchSpin({verticalbuttons:true,min:parseFloat(s_min),max:parseFloat(s_max),step:parseFloat(s_step),verticalupclass:'sfdc-glyphicon sfdc-glyphicon-plus',verticaldownclass:'sfdc-glyphicon sfdc-glyphicon-minus',initval:parseFloat(s_value)});});}
if(obj_form.find('.rockfm-input15-switch').length){var rockfm_switch_d=obj_form.find('.rockfm-input15-switch');rockfm_switch_d.each(function(i){$(this).bootstrapSwitchZgpb({onText:$(this).attr('data-uifm-txt-yes'),offText:$(this).attr('data-uifm-txt-no')});});}
if(obj_form.find('.rockfm-input17-wrap .uifm-dcheckbox-item').length){obj_form.find('.rockfm-input17-wrap .uifm-dcheckbox-item').uiformDCheckbox();}
if(obj_form.find('.rockfm-input17-wrap .uifm-dradiobtn-item').length){obj_form.find('.rockfm-input17-wrap .uifm-dradiobtn-item').uiformDCheckbox();}
if(obj_form.find('.g-recaptcha').length){if(parseInt(obj_form.find('.g-recaptcha').length)>0){var rockfm_rcha_d=obj_form.find('.g-recaptcha');rockfm_rcha_d.each(function(i){$(this).attr('id','zgfm_recaptcha_obj_'+obj_form.find('._rockfm_form_id').val());});}
if(parseInt(obj_form.find('.g-recaptcha').length)>1){var rockfm_rcha_d=obj_form.find('.g-recaptcha');rockfm_rcha_d.each(function(i){if(parseInt(i)!=0){$(this).removeClass('g-recaptcha').html('ReCaptcha is loaded once. Remove this field');}});}
if(!$('#zgfm_form_lib_recaptcha').length){var rockfm_recaptcha=document.createElement('script');rockfm_recaptcha.type='text/javascript';rockfm_recaptcha.async=true;rockfm_recaptcha.id='zgfm_form_lib_recaptcha';rockfm_recaptcha.defer='defer';rockfm_recaptcha.src='https://www.google.com/recaptcha/api.js?onload=zgfm_recaptcha_onloadCallback&render=explicit';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(rockfm_recaptcha,s);}}
if(obj_form.find('.rockfm-captcha').length){if(parseInt(obj_form.find('.rockfm-captcha').length)>1){var rockfm_capcha_d=obj_form.find('.rockfm-captcha');rockfm_capcha_d.each(function(i){if(parseInt(i)!=0){$(this).find('.rockfm-inp6-captcha').removeClass('rockfm-inp6-captcha').html('Captcha is loaded once. Remove this field');}});}
var rockfm_capcha_refobj=obj_form.find('.rockfm-captcha .rockfm-inp6-wrap-refrescaptcha a');rocketfm.captcha_refreshImage(rockfm_capcha_refobj);}
if(obj_form.find('.rockfm-input7-datepic').length){var rockfm_datepic_d=obj_form.find('.rockfm-input7-datepic');var rkfm_datepic_tmp1,rkfm_datepic_tmp2;rockfm_datepic_d.each(function(i){$(this).datetimepicker({format:'L'});rkfm_datepic_tmp1=$(this).attr('data-rkfm-language');if(rkfm_datepic_tmp1){$(this).data('DateTimePicker').locale(rkfm_datepic_tmp1);}
rkfm_datepic_tmp2=$(this).attr('data-rkfm-showformat');if(rkfm_datepic_tmp2){$(this).data('DateTimePicker').dayViewHeaderFormat(rkfm_datepic_tmp2);$(this).data('DateTimePicker').format(rkfm_datepic_tmp2);}});}
if(obj_form.find('.uifm-input-flatpickr').length){var rockfm_datepic_d=obj_form.find('.uifm-input-flatpickr');var rkfm_datepic_tmp1,rkfm_datepic_tmp2;var flatpick_instance;rockfm_datepic_d.each(function(i){var tmp={};if(parseInt($(this).attr('data-rkfm-enabletime'))===1){tmp['enableTime']=true;}else{tmp['enableTime']=false;}
if(parseInt($(this).attr('data-rkfm-nocalendar'))===1){tmp['noCalendar']=true;}else{tmp['noCalendar']=false;}
if(parseInt($(this).attr('data-rkfm-time24hr'))===1){tmp['time_24hr']=true;}else{tmp['time_24hr']=false;}
if(parseInt($(this).attr('data-rkfm-altinput'))===1){tmp['altInput']=true;}else{tmp['altInput']=false;}
if(String($(this).attr('data-rkfm-altformat')).length>0){tmp['altFormat']=$(this).attr('data-rkfm-altformat');}else{tmp['altFormat']="F j, Y";}
if(String($(this).attr('data-rkfm-dateformat')).length>0){tmp['dateFormat']=$(this).attr('data-rkfm-dateformat');}else{tmp['dateFormat']="Y-m-d";}
tmp['locale']=$(this).attr('data-rkfm-language');if(String($(this).attr('data-rkfm-mindate')).length>0){tmp['minDate']=$(this).attr('data-rkfm-mindate');}
if(String($(this).attr('data-rkfm-maxdate')).length>0){tmp['maxDate']=$(this).attr('data-rkfm-maxdate');}
if(String($(this).attr('data-rkfm-defaultdate')).length>0){tmp['defaultDate']=$(this).attr('data-rkfm-defaultdate');}
tmp['allowInput']=true;if(parseInt($(this).attr('data-rkfm-isinline'))===1){tmp['inline']=true;}else{tmp['wrap']=true;}
tmp['onChange']=function(selectedDates,dateStr,instance){$(instance.element).find('input').val(dateStr);};flatpick_instance=flatpickr($(this)[0],tmp);$(this).data('zgfm_flatpicker',flatpick_instance);});}
if(obj_form.find('.rockfm-input7-timepic').length){var rockfm_timepic_d=obj_form.find('.rockfm-input7-timepic');rockfm_timepic_d.each(function(i){$(this).datetimepicker({format:'LT'});});}
if(obj_form.find('.rockfm-input7-datetimepic').length){var rockfm_datetm_d=obj_form.find('.rockfm-input7-datetimepic');var rkfm_datetm_tmp1,rkfm_datetm_tmp2;rockfm_datetm_d.each(function(i){$(this).datetimepicker({minDate:new Date()});rkfm_datetm_tmp1=$(this).attr('data-rkfm-language');if(rkfm_datetm_tmp1){$(this).data('DateTimePicker').locale(rkfm_datetm_tmp1);}
rkfm_datetm_tmp2=$(this).attr('data-rkfm-showformat');if(rkfm_datetm_tmp2){$(this).data('DateTimePicker').dayViewHeaderFormat(rkfm_datetm_tmp2);}});obj_form.find('.rockfm-input7-datetimepic').datetimepicker();}
if(obj_form.find('.rockfm-input-ratingstar').length){var rockfm_rstar_d=obj_form.find('.rockfm-input-ratingstar');rockfm_rstar_d.each(function(i){$(this).rating({starCaptions:{1:$(this).attr('data-uifm-txt-star1')||'very bad',2:$(this).attr('data-uifm-txt-star2')||'bad',3:$(this).attr('data-uifm-txt-star3')||'ok',4:$(this).attr('data-uifm-txt-star4')||'good',5:$(this).attr('data-uifm-txt-star5')}||'very good',clearCaption:$(this).attr('data-uifm-txt-norate'),starCaptionClasses:{1:"text-danger",2:"text-warning",3:"text-info",4:"text-primary",5:"text-success"}});});}
var tmp_load_obj;if(obj_form.find('.rockfm-input2-sel-styl1').length){tmp_load_obj=obj_form.find('.rockfm-input2-sel-styl1');tmp_load_obj.each(function(i){$(this).selectpicker({noneSelectedText:$(this).parent().attr('data-theme-stl1-txtnosel'),noneResultsText:$(this).parent().attr('data-theme-stl1-txtnomatch'),countSelectedText:$(this).parent().attr('data-theme-stl1-txtcountsel'),});});}
if(obj_form.find('.rockfm-input2-chk-styl1').length){tmp_load_obj=obj_form.find('.rockfm-input2-chk-styl1');var tmp_chk_icon;tmp_load_obj.each(function(i){tmp_chk_icon=$(this).attr('data-chk-icon');$(this).checkradios({checkbox:{iconClass:tmp_chk_icon},radio:{iconClass:tmp_chk_icon}});});}
if(obj_form.find('.rockfm-colorpicker-wrap').length){var rockfm_cpicker_d=obj_form.find('.rockfm-colorpicker-wrap');rockfm_cpicker_d.each(function(i){$(this).colorpicker();});}
if(obj_form.find('[data-rockfm-gfont]').length){var rockfm_tmp=obj_form.find('[data-rockfm-gfont]');var rockfm_uniq_font=[];rockfm_tmp.each(function(i){if($.inArray($(this).attr('data-rockfm-gfont'),rockfm_uniq_font)===-1){var atImport='@import url(//fonts.googleapis.com/css?family='+$(this).attr('data-rockfm-gfont');$('<style>').append(atImport).appendTo('head');rockfm_uniq_font.push($(this).attr('data-rockfm-gfont'));}});}
if(obj_form.find('.rockfm-clogic-fcond').length){obj_form.zgfm_logicfrm(obj_form.find('.rockfm_clogic_data').val());obj_form.data('zgfm_logicfrm').setData();obj_form.data('zgfm_logicfrm').refreshfields();}
if(obj_form.find('.rockfm_main_data')){obj_form.zgpb_datafrm(obj_form.find('.rockfm_main_data').val());}else{obj_form.zgpb_datafrm();}
$('.uiform-main-form [data-toggle="tooltip"]').tooltip({'selector':'','placement':'top','container':obj_form,html:true});obj_form.find('input, textarea').placeholder();if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.size();}}
if(parseInt(obj_form.data('zgpb_datafrm').getData("onload_scroll"))===1){if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.scrollTo(0,obj_form.offset().top);}}else{$('html,body').animate({scrollTop:obj_form.offset().top},'slow');}}
for(var key in _uifmvar['addon']){if(_uifmvar['addon'].hasOwnProperty(key)){switch(key){case'addon_func_anim':zgfm_addon_anim_front.initialize();break;}}}
zgfm_front_helper.load_form_init_events(obj_form);$(document).trigger('zgfm.form.init_loaded',{form:obj_form});obj_form.on('click','.rockfm-submitbtn.rockfm-field [type="submit"]',function(e){e.preventDefault();var obj_form_alt=$(this).closest('.rockfm-form');rocketfm.setInnerVariable('submitting_form_id',obj_form_alt.find('._rockfm_form_id').val());rocketfm.submitForm_process(obj_form_alt,e);});}});};arguments.callee.submitForm_process=function(obj_form,e){rocketfm.submitForm_process_beforeVal(function(data){if(data.is_valid===true){rocketfm.submitForm_process_validation(e,obj_form,function(data){if(data.is_valid===true){rocketfm.submitForm_submit(obj_form);}});}},function(error){console.log('error '+error.test);});};arguments.callee.submitForm_process_validation=function(e,obj_form,callback){var el_form=obj_form;this.setInnerVariable('val_curform_obj',el_form);var res_val=this.validate_form(el_form);var events=rocketfm.getInnerVariable('submit_form_events');if(res_val.isValid){if(el_form.find('.g-recaptcha').length){this.recaptcha_validate();}else if(el_form.find('.rockfm-inp6-captcha').length){this.captcha_validate();}else{if(zgfm_front_helper.event_isDefined_toEl(document,'additional_validation.form',events)){$(document).trigger('zgfm.form.additional_validation',[callback]);}else{callback({is_valid:true});}}}};arguments.callee.submitForm_process_beforeVal=function(callback,errorCallback){if(false){errorCallback({test:'test1'});}else{var eventos=$(document).getZgfmEvents();rocketfm.setInnerVariable('submit_form_events',eventos);if(zgfm_front_helper.event_isDefined_toEl(document,'before_submit.form',eventos)){$(document).trigger('zgfm.form.before_submit',[callback]);}else{callback({is_valid:true});}}};arguments.callee.previewfield_removeAllPopovers=function(){var tmp_popover=$('.uiform-main-form [aria-describedby^=popover]');if(tmp_popover){$.each(tmp_popover,function(index,element){$(element).popover('destroy');});}};arguments.callee.wizard_nextButton=function(el){var el_form=$(el).closest('.rockfm-form');this.setInnerVariable('val_curform_obj',el_form);rocketfm.setInnerVariable('submitting_form_id',el_form.find('._rockfm_form_id').val());var objform=$(el).closest('.rockfm-form');var objtabs=objform.find('.uiform-steps li');var tabs_num=objtabs.length;var tab_cur_index=objform.find('.uiform-steps li.uifm-current').index();var tab_next_obj=objform.find('.uiform-steps li.uifm-current').next();var tab_next_index=tab_next_obj.index();var gotab_next;var gotab_next_cont;var gotab_cur;var gotab_cur_cont;gotab_cur=objtabs.eq(tab_cur_index);gotab_cur_cont=$(gotab_cur).find("a").attr("data-tab-href");var obj_cur_form=objform.find(gotab_cur_cont);var res_val=this.validate_form(obj_cur_form);var events=rocketfm.getInnerVariable('submit_form_events');if(!events){var eventos=$(document).getZgfmEvents();rocketfm.setInnerVariable('submit_form_events',eventos);}
rocketfm.wizard_nextButton_validate(obj_cur_form,res_val,function(data){if(data.is_valid===true){rocketfm.previewfield_removeAllPopovers();if(parseInt(el_form.data('zgpb_datafrm').getData("onload_scroll"))===1){if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.scrollTo(0,el_form.offset().top);}}else{$('html,body').animate({scrollTop:el_form.offset().top},'slow');}}
gotab_cur.removeClass('uifm-current').addClass('uifm-complete');objform.find(gotab_cur_cont).hide();gotab_next=objtabs.eq(tab_next_index);gotab_next.removeClass('uifm-disabled').addClass('uifm-current');gotab_next_cont=$(gotab_next).find("a").attr("data-tab-href");objform.find(gotab_next_cont).show();var tmp_nex_cur_form=objform.find(gotab_next_cont);tmp_nex_cur_form.show();if(parseFloat(tab_cur_index)<parseFloat(tab_next_index)){var tab_next2_obj_index=tab_next_obj.next().index();objform.find('.rockfm-btn-wizprev').removeAttr('disabled');if(parseFloat(tab_next2_obj_index)>0&&parseFloat(tab_next2_obj_index)>parseFloat(tab_next_index)){}else{var wiznext_lasttxt=tmp_nex_cur_form.find('.rockfm-btn-wiznext').attr('data-value-last')||'finish';tmp_nex_cur_form.find('.rockfm-btn-wiznext').find('.rockfm-inp-lbl').html(wiznext_lasttxt);}}else{var obj_btn=el_form.find('.rockfm-btn-wiznext');obj_btn.html(obj_btn.html()+' <i class="sfdc-glyphicon sfdc-glyphicon-refresh gly-spin"></i>');obj_btn.attr("disabled",true);rocketfm.submitForm_submit(el_form);}};});if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.size();}}};arguments.callee.wizard_nextButton_validate=function(el_form,res_val,callback){var events=rocketfm.getInnerVariable('submit_form_events');if(res_val.isValid){if(el_form.find('.g-recaptcha').length){this.recaptcha_validate();}else if(el_form.find('.rockfm-inp6-captcha').length){this.captcha_validate();}else{if(zgfm_front_helper.event_isDefined_toEl(document,'form.wizbtn_additional_validation',events)){$(document).trigger('zgfm.form.wizbtn_additional_validation',[callback]);}else{callback({is_valid:true});}}}};arguments.callee.wizard_prevButton=function(el){var objform=$(el).closest('.rockfm-form');var objtabs=objform.find('.uiform-steps li');var tabs_num=objtabs.length;var tab_cur_index=objform.find('.uiform-steps li.uifm-current').index();var tab_prev_obj=objform.find('.uiform-steps li.uifm-current').prev();var tab_prev_index=tab_prev_obj.index();var gotab_prev;var gotab_prev_cont;var gotab_cur;var gotab_cur_cont;if(tab_prev_obj){gotab_cur=objtabs.eq(tab_cur_index);gotab_cur.removeClass('uifm-current').removeClass('uifm-complete').addClass('uifm-disabled');gotab_cur_cont=$(gotab_cur).find("a").attr("data-tab-href");objform.find(gotab_cur_cont).hide();gotab_prev=objtabs.eq(tab_prev_index);gotab_prev.removeClass('uifm-disabled').removeClass('uifm-complete').addClass('uifm-current');gotab_prev_cont=$(gotab_prev).find("a").attr("data-tab-href");objform.find(gotab_prev_cont).show();}
if(parseFloat(tab_cur_index)>parseFloat(tab_prev_index)){var tab_prev2_obj_index=tab_prev_obj.prev().index();if(parseFloat(tab_prev2_obj_index)>=0&&parseFloat(tab_prev2_obj_index)<parseFloat(tab_prev_index)){}else{this.previewfield_removeAllPopovers();var wiznext_ntxt=objform.find('#uifm-step-tab-'+tab_prev_index).find('.rockfm-btn-wiznext').attr('data-value-next')||'next';objform.find('.rockfm-btn-wiznext .rockfm-inp-lbl').html(wiznext_ntxt);objform.find('.rockfm-btn-wizprev').attr('disabled','disabled');}}
if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.size();}}
$('.popover').popover('hide');};arguments.callee.add_formloaded=function(value){var temp;temp=this.getInnerVariable('form_loaded');if(temp===''){temp=[];this.setInnerVariable('form_loaded',[]);}
temp.push(value);this.setInnerVariable('form_loaded',temp);};arguments.callee.run_form=function(form_id){var check_field=$.inArray(form_id,this.getInnerVariable('form_loaded'));if(check_field<0){this.add_formloaded(form_id);this.loadform_content(form_id);}};arguments.callee.test_slider=function(){console.log('ups slider');$('#ex2').slider();};arguments.callee.loadform_content=function(form_id){var form_obj=$('#uifm_container_'+form_id);$.ajax({async:true,type:"post",url:UIFORM_WWW+'uiformbuilder/getform',data:"id="+encodeURIComponent(form_id),dataType:"html",beforeSend:function(){},success:function(response){var msg;if(response){var arrJson=$.parseJSON(response);msg=decodeURIComponent(arrJson.html_content);}else{msg='Error. Try refresh again.';}
form_obj.html(msg);rocketfm.loadform_init();},complete:function()
{},error:function(data,errorThrown)
{console.log('request failed :'+errorThrown);}});};arguments.callee.modal_resizeWhenIframe=function(){if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){var height=$('.uiform_modal_general').find('.sfdc-modal-body').height();parentIFrame.size(parseFloat(height)+300);}}};arguments.callee.modal_onclose=function(){if(String(uifmvariable.externalVars["fm_loadmode"])==="iframe"){if('parentIFrame'in window){parentIFrame.size();}}};arguments.callee.redirect_tourl=function(redirect){if(window.event){window.event.returnValue=false;window.location=redirect;}else{location.href=redirect;}};};})($uifm,window);};(function($){var
rCRLF=/\r?\n/g,rsubmitterTypes=/^(?:submit|button|image|reset|file)$/i,rsubmittable=/^(?:input|select|textarea|keygen)/i;var rcheckableType=(/^(?:checkbox|radio)$/i);$.fn.getZgfmEvents=function(){if(typeof($._data)=='function'){return $._data(this.get(0),'events')||{};}else if(typeof(this.data)=='function'){return this.data('events')||{};}
return{};};$.fn.removeCss=function(){var removedCss=$.makeArray(arguments);return this.each(function(){var e$=$(this);var style=e$.attr('style');if(typeof style!=='string')return;style=$.trim(style);var styles=style.split(/;+/);var sl=styles.length;for(var l=removedCss.length,i=0;i<l;i++){var r=removedCss[i];if(!r)continue;for(var j=0;j<sl;){var sp=$.trim(styles[j]);if(!sp||(sp.indexOf(r)===0&&$.trim(sp.substring(r.length)).indexOf(':')===0)){styles.splice(j,1);sl--;}else{j++;}}}
if(styles.length===0){e$.removeAttr('style');}else{e$.attr('style',styles.join(';'));}});};$.fn.extend({uifm_serialize:function(){return $.param(this.uifm_serializeArray());},uifm_serializeArray:function(){return this.map(function(){var elements=$.prop(this,"elements");var exclude_array=[];var exclude_fields=$(this).closest('.rockfm-form').find('.rockfm-conditional-hidden :input,.rockfm-conditional-hidden select');exclude_array=$.map(exclude_fields,function(n,i){return $(n).attr('name');});var new_elements=[];$.each(elements,function(i,val){if(parseInt($.inArray($(val).attr('name'),exclude_array))<0){new_elements.push(val);}});return new_elements?$.makeArray(new_elements):this;}).filter(function(){var type=this.type;return this.name&&!$(this).is(":disabled")&&rsubmittable.test(this.nodeName)&&!rsubmitterTypes.test(type)&&(this.checked||!rcheckableType.test(type));}).map(function(i,elem){var val=$(this).val();return val==null?null:$.isArray(val)?$.map(val,function(val){return{name:elem.name,value:val.replace(rCRLF,"\r\n")};}):{name:elem.name,value:val.replace(rCRLF,"\r\n")};}).get();}});$('.uiform_modal_general').on('hidden.bs.modal',function(){rocketfm.modal_onclose();});$('.uiform_modal_general').on('shown.bs.modal',function(){rocketfm.modal_resizeWhenIframe();});})($uifm);var zgfm_recaptcha_elems={};var zgfm_recaptcha_onloadCallback=function(){var tmp_sitekey;var tmp_form_id;$uifm('.g-recaptcha').each(function(i){tmp_sitekey=$uifm(this).attr('data-sitekey');tmp_form_id=$uifm(this).closest('.rockfm-form').find('._rockfm_form_id').val();zgfm_recaptcha_elems['recaptcha_'+tmp_form_id]=grecaptcha.render('zgfm_recaptcha_obj_'+tmp_form_id,{'sitekey':tmp_sitekey});});};