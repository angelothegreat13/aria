function getCookie(e) {
	for (var t = document.cookie.split("; "), a = 0; a < t.length; a++) {
		var n = t[a].split("=");
		if (e === n[0]) return unescape(n[1]);
	}
	return null;
}
function setCookie(e, t, a) {
	var n = new Date();
	n.setDate(n.getDate() + a), (document.cookie = e + "=" + escape(t) + "; path=/; expires=" + n.toGMTString() + ";");
}

function addPopup(e, t, a, n, i) {
	var o = document.getElementById(e);
	(o.style.top = t + "px"), (o.style.left = a + "px"), (o.style.width = n + "px"), (o.style.height = i + "px"), (o.style.display = "block"), dragElement(document.getElementById(e));
}
function hidePopup(e, t, a) {
	setCookie(e, t, a), (document.getElementById(e).style.display = "none");
}
function popupClose(e) {
	document.getElementById(e).style.display = "none";
}
function dragElement(t) {
	var a = 0,
		n = 0,
		i = 0,
		o = 0;
	function e(e) {
		(e = e || window.event), (i = e.clientX), (o = e.clientY), (document.onmouseup = l), (document.onmousemove = s);
	}
	function s(e) {
		(e = e || window.event), (a = i - e.clientX), (n = o - e.clientY), (i = e.clientX), (o = e.clientY), (t.style.top = t.offsetTop - n + "px"), (t.style.left = t.offsetLeft - a + "px");
	}
	function l() {
		(document.onmouseup = null), (document.onmousemove = null);
	}
	document.getElementById(t.id + "header") ? (document.getElementById(t.id + "header").onmousedown = e) : (t.onmousedown = e);
}
function levelUpCheck() {
	"Y" === $("#is_level").val() && $.ajax({ url: "/player/level/level.detail", type: "GET", data: {}, dataType: "json", headers: {}, success: function (e) {}, error: function () {}, complete: function () {} });
}
function addAmount(e, t) {
	var a = 1 === e ? $("#depositAmount") : $("#withdrawalAmount"),
		e = Number(a.val());
	(e += 1e4 * t), isNaN(e) && (e = 0), a.val(e), a.focus();
}
function resetAmount(e) {
	(1 === e ? $("#depositAmount") : $("#withdrawalAmount")).val("");
}

function addCPAmount(e, t) {
	var a = 1 === e ? $("#compAmount") : $("#pointAmount"),
		e = Number(a.val());
	(e += 1e4 * t), isNaN(e) && (e = 0), a.val(e), a.focus();
}
function resetCPAmount(e) {
	(1 === e ? $("#compAmount") : $("#pointAmount")).val("");
}
 
function chkSignedIn() {
	let isSignIn = $("#is_sign_in").val() | 0;
	if (!isSignIn) {
		console.trace();
		if (typeof showLoginForm == "function") {
			showLoginForm();
		} else if (typeof showMsg == "function") {
			showMsg("로그인이 필요합니다.", "error");
		}
		return false;
	}
	return true;
}
function doLogout() {
	confirmMsgYn("로그아웃 하시겠습니까?", function () {
		closePopupGame();
		$(".after-login").removeClass("active");
		$(".before-login").addClass("active");
		$("body").removeClass("active");
		$(".sn-overlay").removeClass("active");
		loading.open();
		window.location.href = "/front/logout";
	});
}
function wagerCheck() {
	chkSignedIn() &&
	($("#withdrawalAmount").val(""),
		$(".player-balance").text("로딩중···"),
		$(".player-balance-input").val("로딩중···"),
		$(".player-point").text("로딩중···"),
		$.ajax({
			url: "/player/wager/detail.info",
			type: "POST",
			data: {},
			dataType: "json",
			headers: {},
			success: function (e) {
				var t = 100 === parseInt(e.wPercent) ? 0 : parseInt(e.wPercent);
				$(".player-balance").html($.number(parseInt(e.pBalance), 0)),
					$(".player-balance-input").val($.number(parseInt(e.pBalance), 0)),
					$(".player-point").html($.number(e.accrualPoint, 0)),
					$(".player-point-info").html($.number(e.accrualPoint, 0)),
					$(".percent-bar").css("width", t + "%"),
					$(".percent-info").html(t + "%");
				e = parseInt(e.pBalance / 1e4);
				$("#withdrawalAmount").val(1e4 * e);
			},
			error: function (e, t, a) {},
			complete: function () {
				loading.isOpened() || loading.close();
			},
		}));
}
function postAjax(e, a, t) {
	loading.open(),
		$.ajax({
			url: "/player/post.info",
			type: "POST",
			data: { page: e, target: a, category: t },
			dataType: "html",
			headers: {},
			success: function (e) {
				var t;
				switch (a) {
					case "FC":
						t = $(".finance-list");
						break;
					case "DP":
						t = $(".deposit-list");
						break;
					case "WT":
						t = $(".withdraw-list");
						break;
					case "BH":
						t = $(".bonuses-list");
						break;
					case "BW":
						t = $(".bet-win-list");
						break;
					case "CP":
						t = $(".coupon-list");
						break;
					case "EV":
						t = $(".event-board-section");
						break;
					case "NT":
						t = $(".notice-board-section");
						break;
					case "MG":
						t = $(".message-list");
						break;
					case "FQ":
						t = $(".faqModal .modal-tab.active");
				}
				t.empty(), t.append(e);
			},
			error: function (e, t, a) {},
			complete: function () {
				loading.close();
			},
		});
}
function statusUpdate(e) {
	chkSignedIn() && $.ajax({ url: "/player/status/detail.info", type: "POST", data: { status: e }, dataType: "text", headers: {}, success: function (e) {}, error: function (e, t, a) {}, complete: function () {} });
}
function sendMessage(e, t) {
	chkSignedIn() &&
	alertify.confirm(
		"알림",
		"운영자에게 계좌문의 메시지를 발송하시겠습니까?",
		function () {
			loading.open(),
				$("input:text[name=subject]").val("[" + t + "] 계좌문의"),
				$("textarea[name=message]").val("입금 계좌문의 드립니다!"),
				$.ajax({
					url: "/player/message/script/write.info",
					type: "POST",
					data: { send_idx: e, send_id: t, receive_type: "M", subject: "[" + t + "] 계좌문의", message: "입금 계좌문의 드립니다!" },
					dataType: "text",
					headers: {},
					success: function (e) {
						0 < parseInt(e) ? alertify.alert("알림", "계좌문의 쪽지를 전송했습니다.") : alertify.alert("알림", "쪽지 전송에 실패했습니다. 잠시 후 시도하세요.");
					},
					error: function (e, t, a) {},
					complete: function () {
						loading.close();
					},
				});
		},
		function () {}
	);
}
function readMessage(a, n, i) {
	chkSignedIn() &&
	(1 < parseInt($("#td-" + a + n + i).attr("data-status")) ||
		$.ajax({
			url: "/player/message/read.info",
			type: "POST",
			data: { messageId: a, receiveType: n, readStatus: i },
			dataType: "json",
			headers: {},
			success: function (e) {
				var t = $(".message-count");
				0 < parseInt(e.updateCount) &&
				($("#" + a + n + i).remove(), $("#td-" + a + n + i).attr("data-status", 2), t.html("( " + e.newMessages + " )"), 0 === parseInt(e.newMessages) && t.css("animation", "letter_anim 0s ease infinite"));
			},
			error: function (e, t, a) {},
			complete: function () {},
		}));
}
function deleteMessage(e, t) {
	chkSignedIn() &&
	$.ajax({
		url: "/player/message/delete.info",
		type: "POST",
		data: { messageId: e, receiveType: t, messageStatus: "DELETE" },
		dataType: "json",
		headers: {},
		success: function (e) {},
		error: function (e, t, a) {},
		complete: function () {},
	});
}
function messageReload() {
	chkSignedIn() && postAjax(1, "MG");
}
// function viewEventDetail(e, t) {
// 	chkSignedIn() &&
// 	(loading.open(),
// 		$.ajax({
// 			url: "/event/view.detail",
// 			type: "POST",
// 			data: { e_idx: e, num: t },
// 			dataType: "html",
// 			headers: {},
// 			success: function (e) {
// 				var t = $(".event-view-section");
// 				t.empty(), t.append(e), ($(".eventViewModal").data("bs.modal") || {})._isShown || $(".eventViewModal").modal("show"), ($(".eventModal").data("bs.modal") || {})._isShown && $(".eventModal").modal("hide");
// 			},
// 			error: function (e, t, a) {},
// 			complete: function () {
// 				loading.close();
// 			},
// 		}));
// }

// function boardPopup(e, t, a) {
// 	chkSignedIn() && ("notice" === e ? $(".notice-link") : $(".event-link")).click();
// }

function openGame(e, t, a, n) {
	var i;
	chkSignedIn() &&
	((i = ""),
		(i = "live" === e ? (n ? "/game/casino/" + t + "/" + a + "/" + n : "/game/casino/" + t + "/" + a) : "hotel" === e ? "/game/hotel/" + t + "/" + a : "/game/slot/" + n),
		window.open(i, "ARIA-CASINO", "left=0,top=0,width=1280,height=743,resizable=no"));
}
function usePoint() {
	var e,
		t = Math.abs($("input[name='use-point-value']").val());
	0 === t || isNaN(t)
		? alertify.alert("알림", "사용할 포인트를 입력하세요.")
		: t < parseFloat($("#point_restrict").val())
		? alertify.alert("알림", $("#point_restrict").val() + "포인트 이상부터 사용가능합니다.")
		: 0 < t % 1e4
			? alertify.alert("알림", "포인트는 1만원 단위로 사용해주세요.")
			: ((e = Math.abs($(".amount.player-point-info").text().replace(/,/gi, "").replace(/(\s*)/gi, ""))),
				isNaN(e)
					? alertify.alert("알림", "보유포인트 조회중입니다. 잠시후 다시 시도하세요.")
					: e < t
					? alertify.alert("알림", "사용포인트가 보유포인트 보다 많습니다.")
					: alertify.confirm(
						"알림",
						"포인트를 사용하시겠습니까?\n사용할 포인트는 " + t + "P 입니다.",
						function () {
							$.ajax({
								url: "/player/point/use.info",
								type: "POST",
								data: { point: t },
								dataType: "json",
								headers: {},
								success: function (e) {
									e.result
										? (alertify.alert("알림", "포인트 사용신청을 완료했습니다.(" + e.message + ")"), $(".player-point").html($.number(e.point, 0)), $(".player-point-info").html($.number(e.point, 0)))
										: alertify.alert("오류", e.message);
								},
								error: function (e, t, a) {},
								complete: function () {
									$("input[name='use-point-value']").val(""), loading.close();
								},
							});
						},
						function () {
							statusUpdate("logOn");
						}
					));
}
function useCoupon(a, n) {
	alertify.confirm(
		"알림",
		"쿠폰을 사용하시겠습니까?",
		function () {
			loading.open();
			var e = $("#btnUse_" + a),
				t = $("#use_yn_" + a);
			e.attr("disabled", "disabled"),
				e.removeClass("btn-primary"),
				e.addClass("btn-default"),
				t.text("사용"),
				$.ajax({
					url: "/player/coupon/use.info",
					type: "POST",
					data: { cid: a, pin: n },
					dataType: "text",
					headers: {},
					success: function (e) {
						"success" === (e = JSON.parse(e)).status ? (wagerCheck(), alertify.alert("알림", e.message)) : "error" === e.status && alertify.alert("알림", e.message);
					},
					error: function (e, t, a) {},
					complete: function () {
						loading.close();
					},
				});
		},
		function () {}
	);
}
function requestCertifyNumber() {
	var e = $("input:text[name='mb_tel']"),
		n = $(".request-certify");
	"" === e.val()
		? alertify.alert("알림", "전화번호를 입력하세요.")
		: e.hasClass("parsley-error")
		? alertify.alert("알림", "전화번호를 확인하세요.")
		: (loading.open(),
			e.hasClass("parsley-error")
				? (alertify.alert("알림", "전화번호를 확인하세요."), loading.close())
				: $.ajax({
					url: "/request/certify/sms.info",
					type: "POST",
					data: { phone: e.val() },
					dataType: "json",
					headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
					success: function (e) {
						"Success" === e.result_message ? alertify.alert("알림", "인증번호를 전송했습니다.") : (n.attr("disabled", !1), alertify.alert("알림", "인증번호를 전송하지 못했습니다. 페이지 새로고침 후 다시 시도하세요."));
					},
					error: function (e, t, a) {
						n.attr("disabled", !1), alertify.alert("알림", "인증번호를 전송하지 못했습니다. 페이지 새로고침 후 다시 시도하세요.");
					},
					complete: function () {
						loading.close();
					},
				}));
}
function requestCertifyCheck() {
	var t = $("input:text[name='certify_number']"),
		e = $("input:text[name='mb_tel']"),
		n = $(".confirm-certify");
	"" === t.val()
		? alertify.alert("알림", "인증번호를 입력하세요.")
		: (n.attr("disabled", !0),
			loading.open(),
			$.ajax({
				url: "/confirm/certify/sms.info",
				type: "POST",
				data: { phoneNumber: e.val(), certifyNumber: t.val() },
				dataType: "json",
				headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
				success: function (e) {
					"Success" === e.message
						? ($("input:hidden[name='certified_number']").val(e.result.certify_number), t.focus(), alertify.alert("알림", "인증번호가 확인 되었습니다."))
						: (n.attr("disabled", !1), alertify.alert("알림", "인증번호가 일치하지 않습니다. 페이지 새로고침 후 다시 시도하세요."));
				},
				error: function (e, t, a) {
					n.attr("disabled", !1), alertify.alert("알림", "인증번호가 일치하지 않습니다. 페이지 새로고침 후 다시 시도하세요.");
				},
				complete: function () {
					loading.close();
				},
			}));
}
$(document).ready(function () {
	$(window).width() <= 1120 && $(".wrapper").removeClass("affix");
	$(window).resize(function () {
		$(window).width() <= 1120 && $(".wrapper").removeClass("affix");
	});
	1121 <= $(window).width() && (480 < $(window).scrollTop() ? $(".wrapper").addClass("affix") : $(".wrapper").removeClass("affix"));
	$(window).scroll(function () {
		1121 <= $(window).width() && (480 < $(window).scrollTop() ? $(".wrapper").addClass("affix") : $(".wrapper").removeClass("affix"));
	});

	$(".login-btn").on("click", function () {});
	$(".logout-btn").on("click", function () {
		doLogout();
	});
	$(".sc-btn").on("mouseover", function () {
		$(this).siblings(".sc-btn").addClass("off");
	}),
	$(".sc-btn").on("mouseout", function () {
		$(".sc-btn").removeClass("off");
	});

	var e = 0;
	$(".casino-section .sc-btn").each(function () {
		$(this).css("animation-delay", e + "s"), (e += 0.1);
	});
	var t = 0;
	$(".slot-section .sc-btn").each(function () {
		$(this).css("animation-delay", t + "s"), (t += 0.1);
	});

	$(window).scroll(function () {
		100 < $(this).scrollTop() ? $(".scroll-top").fadeIn() : $(".scroll-top").fadeOut();
	}),
	$(".scroll-top").on("click", function () {
		return $("html, body").animate({ scrollTop: 0 }, 600), !1;
	}),
	$(".scroll-top").on("click", function () {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}),
	$('body').on("click", ".login-link", function () {
		$(".loginModal").modal("show"), $(".loginModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".join-link", function () {
		$(".joinModal").modal("show"), $(".joinModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".deposit-link", function () {
		if (!chkSignedIn()) return;
		$(".depositModal").modal("show"), $(".depositModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".withdraw-link", function () {
		if (!chkSignedIn()) return;
		$(".withdrawModal").modal("show"), $(".withdrawModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".comp-link", function () {
		if (!chkSignedIn()) return;
		$(".compModal").modal("show"), $(".compModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".point-link", function () {
		if (!chkSignedIn()) return;
		$(".pointModal").modal("show"), $(".pointModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".event-link", function () {
		if (!chkSignedIn()) return;
		$(".eventModal").modal("show");
		$(".eventModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".eventview-link", function () {
		if (!chkSignedIn()) return;
		let id = $(this).data('id');
		$(".eventViewModal").data('id', id);
		$(".eventViewModal").modal("show");
		$(".eventViewModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".notice-link", function () {
		if (!chkSignedIn()) return;
		$(".noticeModal").modal("show");
		$(".noticeModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".noticeview-link", function () {
		if (!chkSignedIn()) return;
		let id = $(this).data('id');
		$(".noticeViewModal").data('id', id);
		$(".noticeViewModal").modal("show");
		$(".noticeViewModal").siblings(".modal").modal("hide");
	}),
	// $('body').on("click", ".faq-link", function () {
	// 	$(".faqModal").modal("show"), $(".faqModal").siblings(".modal").modal("hide"), 1 === $(".faq-basic tbody tr").length && "데이터를 가져오는 중입니다." === $(".faq-basic tbody tr td").text() && postAjax(1, "FQ", "basic");
	// }),
	$('body').on("click", ".mypage-link", function () {
		if (!chkSignedIn()) return;
		let tab = $(this).data('target');
		if (tab) $(".myPageModal").data('last_tab', tab);
		
		if ($('.myPageModal').hasClass('show')) {
			$('.myPageModal').triggerHandler('show.bs.modal');
		} else {
			$(".myPageModal").modal("show"), $(".myPageModal").siblings(".modal").modal("hide");
		}
	}),
	$('body').on("click", ".deposit-hist-link", function () {
		if (!chkSignedIn()) return;
		$(".depositHistModal").modal("show"), $(".depositHistModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".withdraw-hist-link", function () {
		if (!chkSignedIn()) return;
		$(".withdrawHistModal").modal("show"), $(".withdrawHistModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".point-hist-link", function () {
		if (!chkSignedIn()) return;
		$(".pointHistModal").modal("show"), $(".pointHistModal").siblings(".modal").modal("hide");
	}),
	$('body').on("click", ".comp-hist-link", function () {
		if (!chkSignedIn()) return;
		$(".compHistModal").modal("show"), $(".compHistModal").siblings(".modal").modal("hide");
	}),

	$(".slot-section .sc-btn .play-btn").on("click", function () {
		if (!chkSignedIn()) return;
		$(".gamelistModal").modal("show");
	}),
	$(".modal-nav a").on("click", function () {
		$(this).addClass("active"), $(this).parent().siblings().find("a").removeClass("active");
		var e = $(this).parent().index() + 1;
		$(this)
			.parentsUntil(".modal-dialog")
			.find(".modal-tab:nth-child(" + e + ")")
			.addClass("active"),
			$(this)
				.parentsUntil(".modal-dialog")
				.find(".modal-tab:nth-child(" + e + ")")
				.siblings()
				.removeClass("active");
	}),
	///////////////////////////////////////////////////
	// $(".with-depth .depth-click").on("click", function () {
	// 	$(this).toggleClass("active"),
	// 		$(this).siblings(".depth-click").removeClass("active"),
	// 		$(this).next(".dropdown").find(".message-content").slideToggle(),
	// 		$(this).next(".dropdown").siblings(".dropdown").find(".message-content").slideUp();
	// }),
	// $(".bs-table tr td .delete-btn").on("click", function () {
	// 	$(this).parentsUntil("tbody").css("display", "none"), $(this).parentsUntil("tbody").next(".dropdown").css("display", "none");
	// }),
	///////////////////////////////////////////////////
	$(".mypage-btn").on("click", function () {
		$(this).toggleClass("opened"), $(".sidebar").slideToggle();
		$('.sidebar-fixed').toggleClass("closed");
	}),
	$(".sn-overlay, .main-menu a, .mypage-link, .login-link, .join-link").on("click", function () {
		$(".left-menu-btn").removeClass("opened"),
			$(".right-menu-btn").removeClass("opened"),
			$(".sidebar-left").removeClass("active"),
			$(".sidebar-right").removeClass("active"),
			$(".sn-overlay").removeClass("active"),
			$("body").removeClass("active");
	}),
	$(window).resize(function () {
		1161 <= $(window).width() &&
		($(".left-menu-btn").removeClass("opened"),
			$(".right-menu-btn").removeClass("opened"),
			$(".sidebar-left").removeClass("active"),
			$(".sidebar-right").removeClass("active"),
			$(".sn-overlay").removeClass("active"),
			$("body").removeClass("active"));
	});
});
	// setTimeout(function () {
	// 	chkSignedIn() && levelUpCheck(), chkSignedIn() && statusUpdate("logOn");
	// }, 1e4),
	// setInterval(function () {
	// 	chkSignedIn() && levelUpCheck();
	// }, 9e4),
	// setInterval(function () {
	// 	chkSignedIn() && wagerCheck();
	// }, 17e4),
	// setInterval(function () {
	// 	chkSignedIn() ? statusUpdate("logOn") : statusUpdate("logOff");
	// }, 18e4),
	$(document).ready(function () {
		var e;
		$("input[name='use-point-value']").number(!0),
			$("#loginForm").submit(function () {
				$(this).on("keyup keypress", function (e) {
					if (13 === (e.keyCode || e.which)) return e.preventDefault(), !1;
				}),
					$(this).parsley().validate(),
				$(this).parsley().isValid() && loading.open();
			}),
			$("#loginFormMobile").submit(function () {
				$(this).parsley().validate(), $(this).parsley().isValid() && loading.open();
			}),
			$("#signUpForm").submit(function () {
				$(this).on("keyup keypress", function (e) {
					if (13 === (e.keyCode || e.which)) return e.preventDefault(), !1;
				}),
					$(this).parsley().validate(),
				$(this).parsley().isValid() && !$("input:text[name='mb_tel']").hasClass("parsley-error") && loading.open();
			}),
			$("#depositForm").submit(function (e) {
				$(this).on("keyup keypress", function (e) {
					if (13 === (e.keyCode || e.which)) return e.preventDefault(), !1;
				});
				var t = Math.abs($("[name=deposit_amount]").val());
				isNaN($(".after-login .player-balance").text().replace(/원/gi, "").replace(/,/gi, "").replace(/(\s*)/gi, ""))
					? (alertify.alert("알림", "보유금 갱신 중입니다. 잠시후 다시 시도하세요."), e.preventDefault())
					: 0 < t % 1e4 || isNaN(t)
					? (alertify.alert("알림", "입금금액은 만원단위로 입력하세요."), e.preventDefault())
					: ($(this).parsley().validate(), $(this).parsley().isValid() && loading.open());
			}),
			$("#withdrawalForm").submit(function (e) {
				$(this).on("keyup keypress", function (e) {
					if (13 === (e.keyCode || e.which)) return e.preventDefault(), !1;
				});
				var t = Math.abs($("[name=withdrawal_amount]").val()),
					a = parseFloat($("#withdrawalForm .player-balance-input").val().replace(/,/gi, "").replace(/(\s*)/gi, ""));
				isNaN(a)
					? (alertify.alert("알림", "조회중입니다. 잠시만기다려주세요."), e.preventDefault())
					: a < t
					? (alertify.alert("알림", "신청금액이 보유금액보다 많습니다. 보유금액을 확인하세요."), e.preventDefault())
					: 0 < t % 1e4 || isNaN(t)
						? (alertify.alert("알림", "출금금액은 만원단위로 입력하세요."), e.preventDefault())
						: ($(this).parsley().validate(), $(this).parsley().isValid() && loading.open());
			}),
			$("#passwordForm").submit(function () {
				$(this).on("keyup keypress", function (e) {
					if (13 === (e.keyCode || e.which)) return e.preventDefault(), !1;
				}),
					$(this).parsley().validate(),
				$(this).parsley().isValid() && loading.open();
			}),
			$("#writeForm").submit(function () {
				$(this).on("keyup keypress", function (e) {
					if (13 === (e.keyCode || e.which)) return e.preventDefault(), !1;
				}),
					$(this).parsley().validate(),
					$(this).parsley().isValid() ? loading.open() : alertify.alert("알림", "입력항목을 확인하세요.");
			}),

			//////////////////////////////////
			// $(".modal-menu li a, .sidebar-left li a").on("click", function () {
			// 	var e;
			// 	void 0 === $(this).data("target") ||
			// 	$(this).hasClass("slot-division") ||
			// 	((e = $(this).data("target")),
			// 	1 === parseInt($(e).children().length) && (void 0 === $(this).data("category") ? postAjax(1, $(this).data("id")) : postAjax(1, $(this).data("id"), $(this).data("category"))),
			// 	".message-list" === e && "데이터를 가져오는 중입니다." === $(".message-list table .title-td").text() && postAjax(1, $(this).data("id")));
			// }),
			// $(".deposit-hist-link").on("click", function () {
			// 	"데이터를가져오는중입니다." === $(".deposit-list table tbody").children().text().replace(/(\s*)/gi, "") && postAjax(1, "DP");
			// }),
			$(".more-link").on("click", function () {
				$(this).hasClass("event-section") ? $(".subpage-link.event-link").click() : $(this).hasClass("notice-section") && $(".subpage-link.notice-link").click();
			});

			//////////////////////////////////

	});
