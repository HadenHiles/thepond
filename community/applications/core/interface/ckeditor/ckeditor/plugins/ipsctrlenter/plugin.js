﻿CKEDITOR.plugins.add("ipsctrlenter",{init:function(a){a.setKeystroke(CKEDITOR.CTRL+13,"ipsCtrlEnter");a.addCommand("ipsCtrlEnter",{exec:function(a){var b=$("."+a.id).closest("form").find('[data-role\x3d"primarySubmit"]');b.length?b.click():$("."+a.id).closest("form").submit()}})}});