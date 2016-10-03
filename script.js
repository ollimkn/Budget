// DOM ready
$(function () {
    // Add button click handler
    $("#btnUpdate").click(function () { UpdateTable(); });
    // Read cookie
    var strDataArray = document.cookie.slice(5).split(",");
    $.each(strDataArray, function ( iIndex, strValue ) {
        var strTmp = strValue.split(":");
        if (strTmp[0] === "tot") {
            if (Number(strTmp[1]) !== NaN) {
                $("#vuosibudjetti").val(Number(strTmp[1]));
            }
        } else if (strTmp[0] === "cumul") {
            if (strTmp[1] === "true") {
                $("#radCumul").prop("checked", true);
                $("#radMonth").prop("checked", false);
            } else {
                $("#radCumul").prop("checked", false);
                $("#radMonth").prop("checked", true);
            }
        } else {
            var iMth = strTmp[0].split("_")[1];
            if (Number(strTmp[1]) !== NaN) {
                $("#mth_act_" + iMth).val(Number(strTmp[1]));
            }
        }
    });
    UpdateTable();
});

// Handler function for Update button
function UpdateTable() {
    var fTotal = $("#vuosibudjetti").val();
    var fTotalActual = 0;
    var bCumul = $("#radCumul").prop("checked");
    var fMonthly = fTotal / 12;
    var fMonthlyPct = (fMonthly / fTotal) * 100;
    var fAmount = 0;
    var fAmountPct = 0;

    $("#tot_fixed").html(fTotal + "€");

    // Update even distribution table
    for (var i = 1; i < 13; i++) {
        if (bCumul) {
            fAmount += fMonthly;
            fAmountPct += fMonthlyPct;
        } else {
            fAmount = fMonthly;
            fAmountPct = fMonthlyPct;
        }
        $("#mth_" + i).html(Math.round(fAmount * 100) / 100 + "€");
        $("#mth_pct_" + i).html(Math.round(fAmountPct * 100) / 100 + "%");
    }

    // Update actual spent table
    for (var i = 1; i < 13; i++) {
        var fExp = Number($("#mth_" + i).html().split("€")[0]);
        var fAct = $("#mth_act_" + i).val();
        if (bCumul) {
            fTotalActual = Number(fAct) > fTotalActual ? Number(fAct) : fTotalActual;
        } else {
            fTotalActual += Number(fAct);
        }
        $("#mth_act_pct_" + i).html(Math.round(((fAct / fTotal) * 100) * 100) / 100 + "%");
        if (fAct > fExp) {
            // Yellow background
            $("#mth_act_pct_" + i).removeClass("withinbudget");
            $("#mth_act_pct_" + i).addClass("overbudget");
        }
        else {
            // Green background
            $("#mth_act_pct_" + i).removeClass("overbudget");
            $("#mth_act_pct_" + i).addClass("withinbudget");
        }
    }
    $("#tot_actual").html(fTotalActual + "€");
    $("#tot_actual_pct").html((fTotalActual / fTotal) * 100 + "%");
    if (fTotalActual > fTotal) {
        // Yellow background
        $("#tot_actual_pct").removeClass("withinbudget");
        $("#tot_actual_pct").addClass("overbudget");
    }
    else {
        // Green background
        $("#tot_actual_pct").removeClass("overbudget");
        $("#tot_actual_pct").addClass("withinbudget");
    }


    // Construct data string for saving in a cookie
    var strData = "data=tot:" + fTotal + ",cumul:" + bCumul;
    for (var i = 1; i < 13; i++) {
        strData += ",mth_" + i + ":" + $("#mth_act_" + i).val();
    }
    document.cookie = "data=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = strData + "; expires=Sat, 31 Dec 2016 23:59:59 UTC";

}