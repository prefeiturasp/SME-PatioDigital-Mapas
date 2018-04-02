mapsBuilder.createChoropleth({
	featureNameProp: 'ds_nome',
	featureNameLabel: 'Distrito',
	featureValueProp: 'mat_dif_abs',
	featureValueLabel: 'vagas',
	featureValueUnit: '',
	dataSourceMsg: 'Dados: SME, 2018',
	legendTitle: 'Diferença de vagas na creche, 2006-2017',
	brewColorRamp: 'BuGn',
	brewNumClasses: 5
});
