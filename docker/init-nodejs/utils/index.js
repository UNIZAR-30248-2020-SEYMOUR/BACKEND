
exports.asignarValorAlCompuestoDay = (muestra, compuestos) => {
    if(muestra.contaminante === 'NO') {
        if(muestra.instante.includes("T00:00")) {
            compuestos.no00_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T01:00")) {
            compuestos.no01_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T02:00")) {
            compuestos.no02_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T03:00")) {
            compuestos.no03_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T04:00")) {
            compuestos.no04_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T05:00")) {
            compuestos.no05_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T06:00")) {
            compuestos.no06_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T07:00")) {
            compuestos.no07_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T08:00")) {
            compuestos.no08_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T09:00")) {
            compuestos.no09_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T10:00")) {
            compuestos.no10_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T11:00")) {
            compuestos.no11_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T12:00")) {
            compuestos.no12_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T13:00")) {
            compuestos.no13_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T14:00")) {
            compuestos.no14_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T15:00")) {
            compuestos.no15_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T16:00")) {
            compuestos.no16_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T17:00")) {
            compuestos.no17_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T18:00")) {
            compuestos.no18_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T19:00")) {
            compuestos.no19_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T20:00")) {
            compuestos.no20_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T21:00")) {
            compuestos.no21_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T22:00")) {
            compuestos.no22_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T23:00")) {
            compuestos.no23_00 = muestra.cantidad
        }
    }
    else if(muestra.contaminante === 'NO2') {
        if(muestra.instante.includes("T00:00")) {
            compuestos.no200_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T01:00")) {
            compuestos.no201_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T02:00")) {
            compuestos.no202_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T03:00")) {
            compuestos.no203_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T04:00")) {
            compuestos.no204_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T05:00")) {
            compuestos.no205_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T06:00")) {
            compuestos.no206_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T07:00")) {
            compuestos.no207_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T08:00")) {
            compuestos.no208_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T09:00")) {
            compuestos.no209_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T10:00")) {
            compuestos.no210_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T11:00")) {
            compuestos.no211_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T12:00")) {
            compuestos.no212_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T13:00")) {
            compuestos.no213_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T14:00")) {
            compuestos.no214_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T15:00")) {
            compuestos.no215_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T16:00")) {
            compuestos.no216_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T17:00")) {
            compuestos.no217_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T18:00")) {
            compuestos.no218_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T19:00")) {
            compuestos.no219_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T20:00")) {
            compuestos.no220_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T21:00")) {
            compuestos.no221_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T22:00")) {
            compuestos.no222_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T23:00")) {
            compuestos.no223_00 = muestra.cantidad
        }
    }
    else if(muestra.contaminante === 'CO') {
        if(muestra.instante.includes("T00:00")) {
            compuestos.co00_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T01:00")) {
            compuestos.co01_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T02:00")) {
            compuestos.co02_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T03:00")) {
            compuestos.co03_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T04:00")) {
            compuestos.co04_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T05:00")) {
            compuestos.co05_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T06:00")) {
            compuestos.co06_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T07:00")) {
            compuestos.co07_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T08:00")) {
            compuestos.co08_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T09:00")) {
            compuestos.co09_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T10:00")) {
            compuestos.co10_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T11:00")) {
            compuestos.co11_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T12:00")) {
            compuestos.co12_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T13:00")) {
            compuestos.co13_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T14:00")) {
            compuestos.co14_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T15:00")) {
            compuestos.co15_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T16:00")) {
            compuestos.co16_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T17:00")) {
            compuestos.co17_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T18:00")) {
            compuestos.co18_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T19:00")) {
            compuestos.co19_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T20:00")) {
            compuestos.co20_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T21:00")) {
            compuestos.co21_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T22:00")) {
            compuestos.co22_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T23:00")) {
            compuestos.co23_00 = muestra.cantidad
        }
    }
    else if(muestra.contaminante === 'O3') {
        if(muestra.instante.includes("T00:00")) {
            compuestos.o300_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T01:00")) {
            compuestos.o301_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T02:00")) {
            compuestos.o302_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T03:00")) {
            compuestos.o303_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T04:00")) {
            compuestos.o304_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T05:00")) {
            compuestos.o305_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T06:00")) {
            compuestos.o306_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T07:00")) {
            compuestos.o307_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T08:00")) {
            compuestos.o308_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T09:00")) {
            compuestos.o309_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T10:00")) {
            compuestos.o310_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T11:00")) {
            compuestos.o311_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T12:00")) {
            compuestos.o312_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T13:00")) {
            compuestos.o313_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T14:00")) {
            compuestos.o314_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T15:00")) {
            compuestos.o315_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T16:00")) {
            compuestos.o316_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T17:00")) {
            compuestos.o317_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T18:00")) {
            compuestos.o318_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T19:00")) {
            compuestos.o319_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T20:00")) {
            compuestos.o320_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T21:00")) {
            compuestos.o321_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T22:00")) {
            compuestos.o322_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T23:00")) {
            compuestos.o323_00 = muestra.cantidad
        }
    }
    else if(muestra.contaminante === 'C6H6') {
        if(muestra.instante.includes("T00:00")) {
            compuestos.c6h600_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T01:00")) {
            compuestos.c6h601_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T02:00")) {
            compuestos.c6h602_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T03:00")) {
            compuestos.c6h603_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T04:00")) {
            compuestos.c6h604_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T05:00")) {
            compuestos.c6h605_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T06:00")) {
            compuestos.c6h606_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T07:00")) {
            compuestos.c6h607_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T08:00")) {
            compuestos.c6h608_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T09:00")) {
            compuestos.c6h609_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T10:00")) {
            compuestos.c6h610_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T11:00")) {
            compuestos.c6h611_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T12:00")) {
            compuestos.c6h612_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T13:00")) {
            compuestos.c6h613_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T14:00")) {
            compuestos.c6h614_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T15:00")) {
            compuestos.c6h615_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T16:00")) {
            compuestos.c6h616_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T17:00")) {
            compuestos.c6h617_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T18:00")) {
            compuestos.c6h618_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T19:00")) {
            compuestos.c6h619_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T20:00")) {
            compuestos.c6h620_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T21:00")) {
            compuestos.c6h621_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T22:00")) {
            compuestos.c6h622_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T23:00")) {
            compuestos.c6h623_00 = muestra.cantidad
        }
    }
    else if(muestra.contaminante === 'PM10') {
        if(muestra.instante.includes("T00:00")) {
            compuestos.pm1000_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T01:00")) {
            compuestos.pm1001_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T02:00")) {
            compuestos.pm1002_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T03:00")) {
            compuestos.pm1003_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T04:00")) {
            compuestos.pm1004_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T05:00")) {
            compuestos.pm1005_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T06:00")) {
            compuestos.pm1006_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T07:00")) {
            compuestos.pm1007_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T08:00")) {
            compuestos.pm1008_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T09:00")) {
            compuestos.pm1009_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T10:00")) {
            compuestos.pm1010_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T11:00")) {
            compuestos.pm1011_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T12:00")) {
            compuestos.pm1012_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T13:00")) {
            compuestos.pm1013_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T14:00")) {
            compuestos.pm1014_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T15:00")) {
            compuestos.pm1015_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T16:00")) {
            compuestos.pm1016_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T17:00")) {
            compuestos.pm1017_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T18:00")) {
            compuestos.pm1018_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T19:00")) {
            compuestos.pm1019_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T20:00")) {
            compuestos.pm1020_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T21:00")) {
            compuestos.pm1021_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T22:00")) {
            compuestos.pm1022_00 = muestra.cantidad
        }
        else if(muestra.instante.includes("T23:00")) {
            compuestos.pm1023_00 = muestra.cantidad
        }
    }
}

exports.asignarValorAlCompuestoHour = (muestra, compuestos) => {
    if(muestra.contaminante === 'NO') {
        compuestos.no = muestra.cantidad
    }
    else if(muestra.contaminante === 'NO2') {
        compuestos.no2 = muestra.cantidad
    }
    else if(muestra.contaminante === 'CO') {
        compuestos.co = muestra.cantidad
    }
    else if(muestra.contaminante === 'O3') {
        compuestos.o3 = muestra.cantidad
    }
    else if(muestra.contaminante === 'C6H6') {
        compuestos.c6h6 = muestra.cantidad
    }
    else if(muestra.contaminante === 'PM10') {
        compuestos.pm10 = muestra.cantidad
    }
}

exports.nombreDeZona = (nombreFeo) => {
    if(nombreFeo === 'actur') {
        return 'Actur'
    }
    if(nombreFeo === 'avenida_soria') {
        return 'Avenida Soria'
    }
    if(nombreFeo === 'jaime_ferran') {
        return 'Jaime Ferrán'
    }
    if(nombreFeo === 'las_fuentes') {
        return 'Las Fuentes'
    }
    if(nombreFeo === 'picarral') {
        return 'Picarral'
    }
    if(nombreFeo === 'renovales') {
        return 'Renovales'
    }
    if(nombreFeo === 'roger_de_flor') {
        return 'Roger de Flor'
    }
    if(nombreFeo === 'centro') {
        return 'Centro'
    }
}

exports.publicPath = require('path').resolve(__dirname, '..') + '/public/'
