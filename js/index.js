function start() {
    $().setMos();
}
function reaction() {
    $().setRea();
}
function mosEle() {
    $().setMosEle();
}
function uploadData(obj) {
    $().importData(obj);
}
$(function() {
        elementID = {"风": 0, "岩": 1, "火": 2, "水": 3, "雷": 4, "冰": 5, "草": 6};
        powerdata = $.ajax({
        type: "get",
        url: "data.json",
        async: false,
        dataType: 'json'
    });
        power = powerdata.responseJSON;
    $.fn.setMos = function() {
        moslist = power['mos'];
        for (var mosName in moslist) {
            $("#mos-name").append('<option id=' + mosName + ' value=' + mosName + '>' + mosName + '</option>');
        }
    }
    $.fn.setRea = function() {
        $("#chr-reaction").html('<option id="none" value="none">不反应</option>\n<option id="shattered" value="shattered">碎冰</option>');
        element = $('#chr-elemnet option:selected').val();
        switch (element) {
            case '风':
                $("#chr-reaction").append('<option id="swirl" value="swirl">扩散</option>');
                break;
            case '岩':
                //$("#chr-reaction").append('<option id="crystallize" value="crystallize">结晶</option>');
                break;
            case '火':
                $("#chr-reaction").append('<option id="vaporize" value="vaporize">蒸发</option>');
                $("#chr-reaction").append('<option id="overload" value="overload">超载</option>');
                $("#chr-reaction").append('<option id="melt" value="melt">融化</option>');
                break;
            case '水':
                $("#chr-reaction").append('<option id="vaporize" value="vaporize">蒸发</option>');
                $("#chr-reaction").append('<option id="electro-charged" value="electro-charged">感电</option>');
                //$("#chr-reaction").append('<option id="frozen" value="frozen">冻结</option>');
                break;
            case '雷':
                $("#chr-reaction").append('<option id="overload" value="overload">超载</option>');
                $("#chr-reaction").append('<option id="electro-charged" value="electro-charged">感电</option>');
                $("#chr-reaction").append('<option id="superconduct" value="superconduct">超导</option>');
                break;
            case '冰':
                $("#chr-reaction").append('<option id="melt" value="melt">融化</option>');
                //$("#chr-reaction").append('<option id="frozen" value="frozen">冻结</option>');
                $("#chr-reaction").append('<option id="superconduct" value="superconduct">超导</option>');
                break;
            case '草':
                $("#chr-reaction").append('<option id="burning" value="burning">燃烧</option>');
                break;
            default:
                break;
        }
    }
    $.fn.setMosEle = function() {
        $("#mos-elemnet").html(null);
        mosName = $('#mos-name option:selected').val();
        moselelist = power['mos'][mosName]['res-element'];
        if (moselelist == null) {
            $("#mos-elemnet").append('<option id="none" value="none">无属性</option>');
        } else {
            for (var moseleitem in moselelist) {
                $("#mos-elemnet").append('<option id=' + moseleitem + ' value=' + moseleitem + '>' + moseleitem + '</option>');
            }
        }
    }
    $.fn.importData = function(obj) {
            ext = $('#import-file').val().split('.').pop().toLowerCase();
        if (ext != 'json') {
            alert('请上传JSON表单文件！您上传的文件类型为' + ext);
            return;
        }
            files = obj.files;
        if (files[0].size > 1048576) {
            alert('请上传小于1MB的文件！您上传的文件大小为' + (files[0].size / 1048576).toFixed(2) + 'MB');
            return;
        }
            reader = new FileReader();
        reader.readAsText(files[0], "UTF-8");
        reader.onload = function(evt) {
            json = JSON.parse(evt.target.result);
            for (var key in json) {
                console.log(json[key]);
                $('#' + key).val(json[key]);
            }
            $('#import').html('成功');
            return;
        }
        $('#import').html('失败');
    }
    function askMosRes(chrElemnet, mosArr) {
        if (chrElemnet == "物理") {
            if ('physics' in mosArr) {
                if (mosArr['physics'] == "immune") {
                    $('#average-score').html('免疫');
                    $('#always-score').html('免疫');
                    $('#crit-score').html('免疫');
                    return "immune";
                }
                mosRes = mosArr['physics'];
            } else {
                mosRes = power['mos']['default']['physics'];
            }
        } else {
            if ('element' in mosArr) {
                if (mosArr['element'][elementID[chrElemnet]] == "immune") {
                    $('#average-score').html('免疫');
                    $('#always-score').html('免疫');
                    $('#crit-score').html('免疫');
                    return "immune";
                }
                mosRes = mosArr['element'][elementID[chrElemnet]];
            } else {
                mosRes = power['mos']['default']['element'][elementID[chrElemnet]];
            }
        }
        return mosRes;
    }
    $("button[name=score]").on('click', function() {
        atk = $('#atk').val();
        critp = $('#crit-p').val() / 100;
        critd = $('#crit-d').val() / 100;
        skill = $('#skill').val() / 100;
        mastery = $('#mastery').val();
        addHurt = $('#addHurt').val() / 100;
        reduceRes = $('#reduce-res').val() / 100;
        reduceDef = $('#reduce-def').val() / 100;
        addition = $('#addition').val();
        multiplication = $('#multiplication').val() / 100;
        special = $('#special').val() / 100;
        chrLevel = $('#chr-level').val();
        chrElemnet = $('#chr-elemnet').val();
        chrReaction = $('#chr-reaction').val();
        mosLevel = $('#mos-level').val();
        mosName = $('#mos-name').val();
        mosElement = $('#mos-elemnet').val();
        CRPart = null;
        addHurtPart = (1 + addHurt) * (1 + multiplication);
        mosArr = power['mos'][mosName];
        if ('res-element' in mosArr) {
            if (chrElemnet in mosArr['res-element'] && chrElemnet == mosElement) {
                if (mosArr['res-element'][chrElemnet] == "immune") {
                    $('#average-score').html('免疫');
                    $('#always-score').html('免疫');
                    $('#crit-score').html('免疫');
                    return;
                }
                mosRes = mosArr['res-element'][chrElemnet];
            } else {
                mosRes = askMosRes(chrElemnet, mosArr);
                if (mosRes == "immune") {
                    return;
                }
            }
        } else {
            mosRes = askMosRes(chrElemnet, mosArr);
            if (mosRes == "immune") {
                return;
            }
        }
        allRes = mosRes - reduceRes;
        if (allRes > 0.75) {
            reduceResPart = 1 / (1 + 4 * allRes);
        } else if (allRes <= 0) {
            reduceResPart = 1 - (allRes / 2);
        } else {
            reduceResPart = 1 - allRes;
        }
        reduceDefPart = 1 / (1 + (5 * mosLevel + 500) * (1 - reduceDef) / (5 * chrLevel + 500));
        if (chrReaction == "none") {
            reactionPart = 1;
        } else if (chrReaction == "vaporize" || chrReaction == "melt") {
            if (chrReaction == "vaporize") {
                if (chrElemnet == "水") {
                    times = 2;
                } else {
                    times = 1.5;
                }
            } else {
                if (chrElemnet == "火") {
                    times = 2;
                } else {
                    times = 1.5;
                }
            }
            reactionPart = ((25 / 9) * (mastery / (mastery + 1400)) + 1) * times;
        } else {
            switch (chrReaction) {
                case 'overload':
                    times = 4;
                    break;
                case 'electro-charged':
                    times = 2.4;
                    break;
                case 'superconduct':
                    times = 1;
                    break;
                case 'burning':
                    times = 0.5;
                    break;
                case 'shattered':
                    times = 3;
                    break;
                case 'swirl':
                    times = 1.2;
                    break;
                default:
                    break;
            }
            reactionPart = 1;
            CRPart = (power['crc'][chrLevel] * reduceResPart * times* (16 * mastery / (mastery + 2000) + 1)).toFixed(3);
        }
        skillPart = 1 + skill;
        specialPart = 1 + special;
        critPart = 1 + critd;
        if (critp >= 1) {
            critp = 1;
        } else if (critp <= 0) {
            critp = 0;
        }
        if ((chrLevel - mosLevel) >= 70 && mosLevel < 10) {
            levelPart = 1.35;
        } else if ((mosLevel - chrLevel) >= 70 && chrLevel <= 10) {
            levelPart = 0.5;
        } else {
            levelPart = 1;
        }
        //最终伤害计算
        alwaysScore = ((atk * addHurtPart * reduceResPart * reduceDefPart * reactionPart * skillPart * specialPart + addition) * levelPart).toFixed(3);
        critScore = (alwaysScore * critPart).toFixed(3);
        if (CRPart == null) {
            $('#average-score').html((critScore * critp + alwaysScore * (1 - critp)).toFixed(3));
            $('#always-score').html(alwaysScore);
            $('#crit-score').html(critScore);
            $("#crd").html(null);
        } else {
            $('#average-score').html((critScore * critp + alwaysScore * (1 - critp)).toFixed(3));
            $('#always-score').html(alwaysScore);
            $('#crit-score').html(critScore);
            $("#crd").html('<tr>\n<td><b>剧变反应</b></td>\n<td>' + CRPart + '</td>\n</tr>');
        }
    });
    $("button[name=export]").on('click', function() {
        exportData = {
            "atk": atk,
            "crit-p": critp * 100,
            "crit-d": critd * 100,
            "skill": skill * 100,
            "mastery": mastery,
            "addHurt": addHurt * 100,
            "reduce-res": reduceRes * 100,
            "reduce-def": reduceDef * 100,
            "addition": addition,
            "multiplication": multiplication * 100,
            "special": special * 100,
            "chr-level": chrLevel,
            "chr-elemnet": chrElemnet,
            "chr-reaction": chrReaction,
            "mos-level": mosLevel,
            "mos-name": mosName,
            "mos-elemnet": mosElement
        };
        exportDataStr = JSON.stringify(exportData);
            blob = new Blob([exportDataStr]);
        $('#export-link').attr('href', URL.createObjectURL(blob));
        $('#export-link').attr('download', Date() + " gitoolData.json");
        $('#export-text').trigger("click");
    });
    $("button[name=import]").on('click', function() {
        $('#import-file').trigger("click");
    });
});