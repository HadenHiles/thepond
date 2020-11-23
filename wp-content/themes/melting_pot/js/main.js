(function ($) {
	$(document).ready(function () {
		/**
		 * Dashboard courses side swipe/drag functionality
		 */
		if ($('.course-container').length > 0) {
			const slider = document.querySelector('.course-container');
			let isDown = false;
			let startX;
			let scrollLeft;

			slider.addEventListener('mousedown', (e) => {
				isDown = true;
				slider.classList.add('active');
				startX = e.pageX - slider.offsetLeft;
				scrollLeft = slider.scrollLeft;
			});
			slider.addEventListener('mouseleave', () => {
				isDown = false;
				slider.classList.remove('active');
			});
			slider.addEventListener('mouseup', () => {
				isDown = false;
				slider.classList.remove('active');
			});
			slider.addEventListener('mousemove', (e) => {
				if (!isDown) return;
				e.preventDefault();
				const x = e.pageX - slider.offsetLeft;
				const walk = (x - startX) * 2; //scroll-fast
				slider.scrollLeft = scrollLeft - walk;
			});

			// Set the minimum hight for the course container
			$('.course-container').css('min-height', $('.section-icons').css('height'));

			var scrollDistance = $('.course-item').width() * 1.5;
			$('#scroll-left-btn').click(function () {
				$('.course-container').animate({
					scrollLeft: slider.scrollLeft - scrollDistance
				}, 300);
			});
			$('#scroll-right-btn').click(function () {
				$('.course-container').animate({
					scrollLeft: slider.scrollLeft + scrollDistance
				}, 300);
			});
		}

		// Move profile pond points to below edit profile link
		// $('#pond-points').appendTo('.ld-profile-card');

		// Enable bootstrap tooltips
		$('[data-toggle="tooltip"]').tooltip();

		// Option to allow full screen image on click
		initFullScreenImageClick();
		$('#skillsVaultModal').on('show.bs.modal', function (event) {
			initFullScreenImageClick();
		});

		// Skills Vault
		var frequencyColumn = 2;
		var skillTypeColumn = 4;
		var skillsVaultTable = $('#skills-vault-table').DataTable({
			searching: true,
			// responsive: {
			// 	details: {
			// 		display: $.fn.dataTable.Responsive.display.childRowImmediate,
			// 		type: 'column',
			// 		target: 'tr'
			// 	},
			// 	columns: [
			// 		{ responsivePriority: 1 },
			// 		{ responsivePriority: 2 },
			// 		{ responsivePriority: 3 },
			// 		{ responsivePriority: 4 }
			// 	]
			// },
			scrollX: true,
			autoFill: false,
			info: false,
			fixedHeader: false,
			paging: true,
			pageLength: 25,
			lengthChange: false,
			language: {
				searchPlaceholder: "Find a Skill",
				emptyTable: "There are no skills in the skills vault yet.",
				zeroRecords: "No skills were found."
			},
			oLanguage: {
				sSearch: ""
			},
			order: [frequencyColumn, 'desc']
		});

		$('#skills-vault-table_filter input[type="search"]').on('keyup', function () {
			$('#skill-types-filter a.nav-link.active').removeClass('active');
			skillsVaultTable.columns().search('').draw();
			skillsVaultTable.search($(this).val());
		});

		$('#skill-types-filter').on('click', 'li a.nav-link', function (e) {
			e.preventDefault();
			if (!$(this).hasClass('active')) {
				$('#skill-types-filter a.nav-link.active').removeClass('active');
				skillsVaultTable.column(skillTypeColumn).search($(this).text()).draw();
				$(this).addClass('active');
			} else {
				$(this).removeClass('active');
				skillsVaultTable.columns().search('').draw();
			}

			var searchTerm = skillsVaultTable.columns(skillTypeColumn).search()[0];
			$('.dataTables_empty').text('No skills were found for "' + searchTerm + '"');
		});

		var $searchButton = $('.skillsVault #search-button');
		$searchButton.appendTo('.dataTables_filter label');
		$searchButton.click(function (e) {
			e.preventDefault();
			skillsVaultTable.search($('#skills-vault-table_filter input[type="search"]').val()).draw();
		});

		// Modal for skills vault
		if ($('#skillsVaultModal').length == 1) {
			$('a.action-button').click(function (e) {
				if ($(this).attr('href') == null) {
					e.preventDefault();

					var button = $(this) // Button that triggered the modal
					var title = button.data('title'); // Extract info from data-* attributes
					var url = button.data('url');
					var buttonText = button.data('button');
					var video = button.data('video');
					var side = button.data('side');
					var all = button.data('all');
					// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
					// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
					var modal = $('#skillsVaultModal');
					modal.find('.modal-title').text(title);
					modal.find('.modal-body').html('<div class="medium-8 columns video"><div class="videoWrapper"></div></div><div class="medium-4 columns side"></div>');
					modal.find('.modal-body .videoWrapper').html(video);
					modal.find('.modal-body .side').html(side);
					if (all != undefined) {
						modal.find('.modal-body').html(all);
					}
					modal.find('a.action').attr('href', url);
					modal.find('a.action').text(buttonText);

					modal.modal({
						backdrop: true
					});
				}
			});
		}
	});
	$('#skillsVaultModal').on('hide.bs.modal', function (event) {
		var modal = $(this);
		modal.find('.modal-title').text('');
		modal.find('.modal-body .videoWrapper').html('');
		modal.find('.modal-body .side').html('');
		modal.find('a.action').attr('href', '');
		modal.find('a.action').text('More');
	});

	//Latest Challenge modal
	$('a[href="#latestChallengeModal"]').click(function (e) {
		e.preventDefault();
		$($(this).attr('href')).modal({
			backdrop: true
		}).modal('toggle');
	});

	/**
	 * Full screen image on click of images with data-enlargable attribute
	 **/
	function initFullScreenImageClick() {
		$('img[data-enlargable]').addClass('img-enlargable').click(function () {
			var src = $(this).attr('src');
			var modal;

			function removeModal() {
				modal.remove();
				$('body').off('keyup.modal-close');
			}

			modal = $('<div class="img-enlargable">').css({
				background: 'RGBA(0,0,0,.75) url(' + src + ') no-repeat center',
				backgroundSize: 'initial',
				width: '100%', height: '100%',
				position: 'fixed',
				zIndex: '10000',
				top: '0', left: '0',
				cursor: 'zoom-out'
			}).click(function () {
				removeModal();
			}).appendTo('body');

			//handling ESC
			$('body').on('keyup.modal-close', function (e) {
				if (e.key === 'Escape') { removeModal(); }
			});
		});
	}

	/**
	 * Scroll to anchors
	 **/
	$(".scroll a").click(function (e) {
		e.preventDefault();
		var url = $(this).attr('href');

		var hasHash = url.indexOf('#') > -1;
		if (!hasHash) {
			e.preventDefault();
			var challengeCheck = url.match(/([^\/]*)\/*$/)[1];
			if (challengeCheck == "challenges") {
				e.preventDefault();
				if ($('#challenges').length == 1) {
					if ($('html').hasClass('MenuActive')) {
						$('.NavBTN.open').trigger('click');
						setTimeout(function () {
							scrollToHash('#challenges', 60)
						}, 5);
					} else {
						scrollToHash('#challenges', 0)
					}
				} else {
					window.location.replace(url);
				}
			} else {
				window.location.replace(url);
			}
		}

		var hash = url.substring(url.indexOf('#'));
		if ($(hash).length > 0) {
			e.preventDefault();
			if ($('html').hasClass('MenuActive')) {
				$('.NavBTN.open').trigger('click');
				setTimeout(function () {
					scrollToHash(hash, 60);
				}, 5);
			} else {
				scrollToHash(hash, 0);
			}
		} else {
			window.location.replace(url);
		}
	});
	$(document).ready(function () {
		if ($('.MemberheaderWrap').css('position') == 'fixed') {
			scrollToHash(window.location.hash, 60);
		} else {
			scrollToHash();
		}
	});

	function scrollToHash(hash = window.location.hash, offset = 0) {
		var aid = hash;
		if (aid != null && $(aid).length == 1) {
			$('html,body').animate({
				scrollTop: $(aid).offset().top - offset
			}, 'slow', function () {
				if (history.pushState) {
					history.pushState(null, null, hash);
				}
				else {
					location.hash = hash;
				}
			});
		}
	}

	/**
	 * Dashboard courses mobile touch functionality
	 **/
	$('#dashboard-courses .course-item').on('click', (e) => {
		var url = $(e.target).closest('.course-item').attr('url');
		if (url != null && url.length > 1) {
			window.location.href = url;
		}
	});
	$('#dashboard-courses .course-item').on('taphold', (e) => {
		e.preventDefault();
		if ($(this).hasClass('hovered')) {
			window.location = $(this).attr('url');
		}

		$('#dashboard-courses .course-item').each(() => {
			$(this).removeClass('hovered');
		});

		$(this).addClass('hovered');
	});

	/**
	 * Show/hide the registration form when clicking "Sign up with Email" button
	 */
	$(document).ready(() => {
		var $formWrapper = $('#register-form-wrapper');
		var $emailBtn = $('#signup-with-email-btn');
		if ($formWrapper.length == 1 && $emailBtn.length == 1) {
			$emailBtn.click(() => {
				$formWrapper.slideToggle({ duration: 300, easing: "swing" });
			});

			if (window.location.hash) {
				$formWrapper.slideToggle({ duration: 300, easing: "swing" });
			}
		}
	});

	/* Password reset */
	if ($('#mepr_forgot_password_form').length == 1) {
		$('#mepr_forgot_password_form').submit((e) => {
			e.preventDefault();

			if ($('#mepr_user_or_email').val().length > 0) {
				var a_key = "AIzaSyCoSWim4GptSro0gly6dN8dClVQMcxeCbA";
				var pid = "the-pond-app";
				var firebaseConfig = {
					apiKey: a_key,
					authDomain: pid + '.firebaseapp.com',
					databaseURL: 'https://' + pid + '.firebaseio.com',
					projectId: pid,
					storageBucket: ''
				};

				// Initialize Firebase
				if (!firebase.apps.length) {
					firebase.initializeApp(firebaseConfig);
				}

				var auth = firebase.auth();

				auth.sendPasswordResetEmail(
					$('#mepr_user_or_email').val(), null)
					.then(function () {
						// Password reset email sent.
						$('#pw_reset_result p').html(`An email has been sent to ${$('#mepr_user_or_email')} with instructions on how to reset your password.`).css({ 'color': '#4BB543' });
						$('#mepr_forgot_password_form').submit();
						$('#mepr_forgot_password_form #wp-submit').attr('disabled', true);
					})
					.catch(function (error) {
						// Error occurred. Inspect error.code.
						$('#pw_reset_result p').html('');
						$('#pw_reset_result p').html('Error sending password reset email.');
						$('#mepr_forgot_password_form #wp-submit').attr('disabled', true);

						setTimeout(() => {
							$('#mepr_forgot_password_form #wp-submit').attr('disabled', false);
						}, 10000);
					});
			}
		});
	}

})(jQuery);
