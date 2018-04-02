mapsBuilder.createChoropleth({
	featureNameProp: 'ds_nome',
	featureNameLabel: 'Distrito',
	featureValueProp: 'com_od_pct',
	featureValueLabel: '% de Ordens Judiciais',
	featureValueUnit: '%',
	dataSourceMsg: 'Dados: SME, 2018',
	legendTitle: '% de Ordens Judiciais, 2015-2017',
	brewColorRamp: 'BuGn',
	brewNumClasses: 5
});
