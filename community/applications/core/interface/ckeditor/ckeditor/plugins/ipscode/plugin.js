﻿CKEDITOR.plugins.add("ipscode",{requires:"widget",icons:"ipscode",hidpi:!0,init:function(c){c.widgets.add("ipscode",{template:"\x3cpre class\x3d'ipsCode'\x3e\x3c/pre\x3e",upcast:function(a){return"pre"==a.name&&a.hasClass("ipsCode")}});c.addCommand("ipsCode",{exec:function(a){var c=ips.getString("editorCodeButton"),d=a.config.controller+"\x26do\x3dcode\x26editorId\x3d"+a.name,e={},b=a.getSelection().getSelectedElement();b&&!b.hasClass("ipsCode")&&(b=b.findOne("pre.ipsCode"));if(b&&b.is("pre")&&b.hasClass("ipsCode")){var h=
"",f=b.getAttribute("class").split(" "),g;for(g in f)"lang-"==f[g].substr(0,5)&&(h=f[g].substr(5));e.val=b.getText();d=d+"\x26lang\x3d"+h}else e.val=a.getSelection().getSelectedText(),d+="\x26lang\x3dhtml";a.focusManager.blur();ips.ui.dialog.create({title:c,fixed:!1,url:d,ajax:{type:"post",data:e}}).show()}});c.ui.addButton("ipsCode",{label:ips.getString("editorCodeButton"),command:"ipsCode",toolbar:"insert"});c.on("doubleclick",function(a){a=a.data.element.getParents(!0);for(i in a){if(a[i].is("div")&&
a[i].hasClass("cke_wysiwyg_div"))break;if(a[i]&&a[i].is("pre")&&a[i].hasClass("ipsCode")){c.getSelection().selectElement(a[i].getParent());c.execCommand("ipsCode");break}}})}});