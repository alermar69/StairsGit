var baseUrl = '/images/calculator/textures';

function getMaterialsConfigs(){
	var config = {
		timber:{
			main:{
				matPar:{
					metalness: 0.1,
					roughness: 0.48,
					bumpScale: 0.1,
					opacity: 1.0,
					color: new THREE.Color(0xFFE2C1)
				},
				mapPar:{
					repeat: {x: 1/200, y: 1/200},
					offset: {x: 0.1, y: 0.1},
				}
			},
			textures:{
				dpc:{
					main:{
						mapUrl: baseUrl + '/stairs/dpc.jpg',
						mapPar:{
							repeat: {x: 1/400, y: 0.00674},
							offset: {x: 0, y: 0}
						}
					}
				},
				pine:{
					main:{
						mapUrl: baseUrl + '/timber/pine_white.jpg',
						mapPar:{
							repeat: {x: 1/800, y: 1/800},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
				pine_prem:{
					main:{
						mapUrl: baseUrl + '/timber/pine_prem_white.jpg',
						mapPar:{
							repeat: {x: 1/1000, y: 1/250},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
				birch:{
					main:{
						mapUrl: baseUrl + '/timber/birch_white.jpg',
						mapPar:{
							repeat: {x: 1/1600, y: 1/780},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
				larch:{
					main:{
						mapUrl: baseUrl + '/timber/larch_white.jpg',
						mapPar:{
							repeat: {x: 1/1000, y: 1/250},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
				larch_prem:{
					main:{
						mapUrl: baseUrl + '/timber/larch_prem_white.jpg',
						mapPar:{
							repeat: {x: 1/1000, y: 1/500},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
				oak:{
					main:{
						mapUrl: baseUrl + '/timber/oak_white.jpg',
						mapPar:{
							repeat: {x: 1/1200, y: 1/600},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
				oak_prem:{
					main:{
						mapUrl: baseUrl + '/timber/oak_prem_white.jpg',
						mapPar:{
							repeat: {x: 1/2000, y: 1/1000},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
				elm_slab:{
					main:{
						mapUrl: baseUrl + '/timber/elm_slab_white.jpg',
						mapPar:{
							repeat: {x: 1/2000, y: 1/1000},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
				oak_slab:{
					main:{
						mapUrl: baseUrl + '/timber/oak_slab_white.jpg',
						mapPar:{
							repeat: {x: 1/1200, y: 1/600},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
				oak_veneer:{
					main:{
						mapUrl: baseUrl + '/timber/oak_prem_white.jpg',
						mapPar:{
							repeat: {x: 1/2000, y: 1/1000},
							offset: {x: 0.1, y: 0.5}
						}
					}
				},
			}
		},
		metal:{
			main:{
				needEnv: true,
				matPar:{
					metalness: 0.5,
					roughness: 0.3,
					bumpScale: 0.1,
					reflectivity: 1,
					envMapIntensity: 0.8,
					opacity: 1.0
				}
			},
			textures:{
				metal: {
					main:{
						mapUrl: baseUrl + '/metal/metal.jpg',
						normalMapUrl: baseUrl + '/metal/maps/metal.jpg',
						mapPar:{
							repeat: {x: 1/200, y: 1/200},
							offset: {x: 0.1, y: 0.1},
						},
						matPar:{
							normalScale: {x: 1, y: -1}
						}
					},
					colors:{
						"черный матовый": {
							main: {
								matPar: {
									metalness: 0.5,
									roughness: 0.6,
									color: new THREE.Color(getMetalColorId('черный матовый'))
								}
							}
						},
						"белый": {
							main:{
								mapUrl: false,
								matPar: {
									metalness: 0.4,
									roughness: 0.5,
									envMapIntensity: 1,
									color: new THREE.Color(getMetalColorId("белый"))
								}
							}
						}
					}
				},
				rif_metal:{
					main:{
						mapUrl: baseUrl + '/stairs/rif_metal.jpg',
						mapPar:{
							repeat: {x: 1/400, y: 1/400},
							offset: {x: 0.1, y: 0.5},
						}
					}
				},
				press_metal:{
					main:{
						mapUrl: baseUrl + '/stairs/press_metal.jpg',
						mapPar:{
							repeat: {x: 1/100, y: 1/100},
							offset: {x: 0.1, y: 0.5}
						}
					}
				}
			}
		},
		plastic_roof: {
			main:{
				needEnv: true,
				matPar:{
					opacity: 0.5,
					metalness: 0.8,
					roughness: 0.1,
					color: new THREE.Color(0xCBF8F2),
					transparent: true,
					combine: THREE.MultiplyOperation,
					reflectivity: 1.0,
				}
			},
			textures:{
				plastic_roof:{}
			}
		},
		metal_roof: {
			main:{
				needEnv: true,
				matPar:{
					//opacity: 0.5,
					metalness: 0.5,
					roughness: 0.5,
					color: new THREE.Color(0xCBF8F2),
					//transparent: true,
					//combine: THREE.MultiplyOperation,
					reflectivity: 1.0,
				}
			},
			textures:{
				metal_roof:{}
			}
		},
		glass:{
			main:{
				needEnv: true,
				matPar:{
					opacity: 0.5,
					metalness: 0.8,
					roughness: 0.1,
					color: new THREE.Color(0xCBF8F2),
					transparent: true,
					combine: THREE.MultiplyOperation,
					reflectivity: 1.0,
				}
			},
			textures:{
				glass:{}
			}
		},
		chrome:{
			main:{
				needEnv: true,
				matPar:{
					color: new THREE.Color(0xFFFFFF),
					specular: new THREE.Color(0xABABAB),
					combine: THREE.MultiplyOperation,
					shininess: 50,
					reflectivity: 1,
					metalness: 0.7,
					roughness: 0,
					opacity: 1.0
				}
			},
			textures:{
				chrome: {}
			}
		},
		floor:{
			main: {
				dynamicColor: true
			},
			textures:{
				painted: {
					main:{
						matPar:{
							metalness: 0.5,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				carpet: {
					main:{
						mapUrl: baseUrl + '/floor/carpet.jpg',
						normalMapUrl: baseUrl + '/floor/maps/carpet.jpg',
						mapPar:{
							repeat: {x: 20, y: 20},
							metalness: 0.1,
						},
						matPar:{
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.9
						}
					}
				},
				carpet_2: {
					main:{
						mapUrl: baseUrl + '/floor/carpet_2.jpg',
						normalMapUrl: baseUrl + '/floor/maps/carpet_2.jpg',
						mapPar:{
							repeat: {x: 20, y: 20},
						},
						matPar:{
							metalness: 0.1,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.9
						}
					}
				},
				carpet_3: {
					main:{
						mapUrl: baseUrl + '/floor/carpet_3.jpg',
						normalMapUrl: baseUrl + '/floor/maps/carpet_3.jpg',
						mapPar:{
							repeat: {x: 20, y: 20},
						},
						matPar:{
							metalness: 0.1,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.9
						}
					}
				},
				carpet_4: {
					main:{
						mapUrl: baseUrl + '/floor/carpet_4.jpg',
						normalMapUrl: baseUrl + '/floor/maps/carpet_4.jpg',
						mapPar:{
							repeat: {x: 20, y: 20},
						},
						matPar:{
							metalness: 0.2,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 1
						}
					}
				},
				carpet_5: {
					main:{
						mapUrl: baseUrl + '/floor/carpet_5.jpg',
						normalMapUrl: baseUrl + '/floor/maps/carpet_5.jpg',
						mapPar:{
							repeat: {x: 30, y: 30},
						},
						matPar:{
							metalness: 0.2,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 1,
							bumpScale: 5
						}
					}
				},
				laminat_1: {
					main:{
						mapUrl: baseUrl + '/floor/laminat_1.jpg',
						normalMapUrl: baseUrl + '/floor/maps/laminat_1.jpg',
						mapPar:{
							repeat: {x: 6, y: 10},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				laminat_2: {
					main:{
						mapUrl: baseUrl + '/floor/laminat_2.jpg',
						normalMapUrl: baseUrl + '/floor/maps/laminat_2.jpg',
						mapPar:{
							repeat: {x: 6, y: 10},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				laminat_3: {
					main:{
						mapUrl: baseUrl + '/floor/laminat_3.jpg',
						normalMapUrl: baseUrl + '/floor/maps/laminat_3.jpg',
						mapPar:{
							repeat: {x: 6, y: 10},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				laminat_4: {
					main:{
						mapUrl: baseUrl + '/floor/laminat_4.jpg',
						normalMapUrl: baseUrl + '/floor/maps/laminat_4.jpg',
						mapPar:{
							repeat: {x: 6, y: 10},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				laminat_5: {
					main:{
						mapUrl: baseUrl + '/floor/laminat_5.jpg',
						normalMapUrl: baseUrl + '/floor/maps/laminat_5.jpg',
						mapPar:{
							repeat: {x: 6, y: 10},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				laminat_7: {
					main:{
						mapUrl: baseUrl + '/floor/laminat_7.jpg',
						normalMapUrl: baseUrl + '/floor/maps/laminat_7.jpg',
						mapPar:{
							repeat: {x: 6, y: 8},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				marf_10: {
					main:{
						mapUrl: baseUrl + '/floor/marf_10.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_10.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				marf_1: {
					main:{
						mapUrl: baseUrl + '/floor/marf_1.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_1.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				marf_2: {
					main:{
						mapUrl: baseUrl + '/floor/marf_2.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_2.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				marf_3: {
					main:{
						mapUrl: baseUrl + '/floor/marf_3.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_3.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				marf_4: {
					main:{
						mapUrl: baseUrl + '/floor/marf_4.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_4.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				marf_5: {
					main:{
						mapUrl: baseUrl + '/floor/marf_5.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_5.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				marf_6: {
					main:{
						mapUrl: baseUrl + '/floor/marf_6.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_6.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				marf_7: {
					main:{
						mapUrl: baseUrl + '/floor/marf_7.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_7.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				marf_8: {
					main:{
						mapUrl: baseUrl + '/floor/marf_8.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_8.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				marf_9: {
					main:{
						mapUrl: baseUrl + '/floor/marf_9.jpg',
						normalMapUrl: baseUrl + '/floor/maps/marf_9.jpg',
						mapPar:{
							repeat: {x: 10, y: 12},
							normalScale: {x: 0.05, y: 0.05},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				plitka_10: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_10.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_10.jpg',
						mapPar:{
							repeat: {x: 15, y: 15},
							normalScale: {x: 0.8, y: 0.8},
						},
						matPar:{
							metalness: 0.3,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.1,
							bumpScale: 5
						}
					}
				},
				plitka_11: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_11.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_11.jpg',
						mapPar:{
							repeat: {x: 30, y: 30},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.4,					
							reflectivity: 1,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				plitka_12: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_12.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_12.jpg',
						mapPar:{
							repeat: {x: 30, y: 30},
							normalScale: {x: 2, y: 3},
						},
						matPar:{
							metalness: 0.3,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.05,
							bumpScale: 5
						}
					}
				},
				plitka_13: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_13.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_13.jpg',
						mapPar:{
							repeat: {x: 17, y: 17},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.4,					
							reflectivity: 0.6,
							refractionRatio: 0,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				plitka_1: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_1.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_1.jpg',
						mapPar:{
							repeat: {x: 15, y: 15},
							normalScale: {x: 0.5, y: 0.1},
						},
						matPar:{
							metalness: 0.3,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				plitka_3: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_3.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_3.jpg',
						mapPar:{
							repeat: {x: 12, y: 12},
							normalScale: {x: 5, y: 5},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0,
							refractionRatio: 0,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},
				plitka_4: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_4.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_4.jpg',
						mapPar:{
							repeat: {x: 9, y: 9},
							normalScale: {x: -0.5, y: 0.5},
						},
						matPar:{
							metalness: 0.35,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				plitka_5: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_5.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_5.jpg',
						mapPar:{
							repeat: {x: 10, y: 10},
							normalScale: {x: 0.5, y: 0.3},
						},
						matPar:{
							metalness: 0.35,
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				plitka_6: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_6.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_6.jpg',
						mapPar:{
							repeat: {x: 25, y: 25},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				plitka_7: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_7.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_7.jpg',
						mapPar:{
							repeat: {x: 25, y: 25},
							normalScale: {x: 3, y: 5},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				plitka_8: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_8.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_8.jpg',
						mapPar:{
							repeat: {x: 25, y: 25},
							normalScale: {x: 3, y: 5},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},
				plitka_9: {
					main:{
						mapUrl: baseUrl + '/floor/plitka_9.jpg',
						normalMapUrl: baseUrl + '/floor/maps/plitka_9.jpg',
						mapPar:{
							repeat: {x: 25, y: 25},
							normalScale: {x: 0.5, y: 1},
						},
						matPar:{
							metalness: 0.3,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				road_brick: {
					main:{
						mapUrl: baseUrl + '/floor/road_brick.jpg',
						normalMapUrl: baseUrl + '/floor/maps/road_brick.jpg',
						mapPar:{
							repeat: {x: 25, y: 25},
							normalScale: {x: 1, y: 3},
						},
						matPar:{
							metalness: 0.3,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},
				road_brick_04: {
					main:{
						mapUrl: baseUrl + '/floor/road_brick_04.jpg',
						normalMapUrl: baseUrl + '/floor/maps/road_brick_04.jpg',
						mapPar:{
							repeat: {x: 14, y: 17},
							normalScale: {x: -1, y: 1},
						},
						matPar:{
							metalness: 0.3,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},
				road_brick_05: {
					main:{
						mapUrl: baseUrl + '/floor/road_brick_05.jpg',
						normalMapUrl: baseUrl + '/floor/maps/road_brick_05.jpg',
						mapPar:{
							repeat: {x: 22, y: 20},
							normalScale: {x: 2, y: 4},
						},
						matPar:{
							metalness: 0.3,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},
				road_brick_06: {
					main:{
						mapUrl: baseUrl + '/floor/road_brick_06.jpg',
						normalMapUrl: baseUrl + '/floor/maps/road_brick_06.jpg',
						mapPar:{
							repeat: {x: 12, y: 12},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				wood_10: {
					main:{
						mapUrl: baseUrl + '/floor/wood_10.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_10.jpg',
						mapPar:{
							repeat: {x: 15, y: 10},
							normalScale: {x: -1, y: -0.5},
						},
						matPar:{
							metalness: 0.22,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.9,
							bumpScale: 5
						}
					}
				},
				wood_11: {
					main:{
						mapUrl: baseUrl + '/floor/wood_11.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_11.jpg',
						mapPar:{
							repeat: {x: 35, y: 35},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				wood_12: {
					main:{
						mapUrl: baseUrl + '/floor/wood_12.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_12.jpg',
						mapPar:{
							repeat: {x: 40, y: 40},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				wood_14: {
					main:{
						mapUrl: baseUrl + '/floor/wood_14.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_14.jpg',
						mapPar:{
							repeat: {x: 40, y: 48},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				wood_15: {
					main:{
						mapUrl: baseUrl + '/floor/wood_15.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_15.jpg',
						mapPar:{
							repeat: {x: 35, y: 35},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.65,
							bumpScale: 5
						}
					}
				},
				wood_1: {
					main:{
						mapUrl: baseUrl + '/floor/wood_1.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_1.jpg',
						mapPar:{
							repeat: {x: 15, y: 17},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.2,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				wood_2: {
					main:{
						mapUrl: baseUrl + '/floor/wood_2.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_2.jpg',
						mapPar:{
							repeat: {x: 10, y: 8},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.2,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.65,
							bumpScale: 5
						}
					}
				},
				wood_3: {
					main:{
						mapUrl: baseUrl + '/floor/wood_3.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_3.jpg',
						mapPar:{
							repeat: {x: 10, y: 8},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.2,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.65,
							bumpScale: 5
						}
					}
				},	
				wood_4: {
					main:{
						mapUrl: baseUrl + '/floor/wood_4.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_4.jpg',
						mapPar:{
							repeat: {x: 8, y: 10},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.65,
							bumpScale: 5
						}
					}
				},
				wood_5: {
					main:{
						mapUrl: baseUrl + '/floor/wood_5.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_5.jpg',
						mapPar:{
							repeat: {x: 8, y: 10},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.65,
							bumpScale: 5
						}
					}
				},	
				wood_6: {
					main:{
						mapUrl: baseUrl + '/floor/wood_6.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_6.jpg',
						mapPar:{
							repeat: {x: 8, y: 10},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.65,
							bumpScale: 5
						}
					}
				},
				wood_7: {
					main:{
						mapUrl: baseUrl + '/floor/wood_7.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_7.jpg',
						mapPar:{
							repeat: {x: 8, y: 10},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},	
				wood_8: {
					main:{
						mapUrl: baseUrl + '/floor/wood_8.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_8.jpg',
						mapPar:{
							repeat: {x: 8, y: 10},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.65,
							bumpScale: 5
						}
					}
				},
				wood_9: {
					main:{
						mapUrl: baseUrl + '/floor/wood_9.jpg',
						normalMapUrl: baseUrl + '/floor/maps/wood_9.jpg',
						mapPar:{
							repeat: {x: 8 / 1.2, y: 10 / 1.2},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 0,
							roughness: 0.65,
							bumpScale: 5
						}
					}
				},
				tiling: {
					main:{
						mapUrl: baseUrl + '/floor/tiling.jpg',
						normalMapUrl: baseUrl + '/floor/maps/tiling.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				stone: {
					main:{
						mapUrl: baseUrl + '/floor/stone.jpg',
						normalMapUrl: baseUrl + '/floor/maps/stone.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				stone2: {
					main:{
						mapUrl: baseUrl + '/floor/stone2.jpg',
						normalMapUrl: baseUrl + '/floor/maps/stone2.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				stone3: {
					main:{
						mapUrl: baseUrl + '/floor/stone3.jpg',
						normalMapUrl: baseUrl + '/floor/maps/stone3.jpg',
						mapPar:{
							repeat: {x: 50, y: 50}
						},
					}
				},
				stone4: {
					main:{
						mapUrl: baseUrl + '/floor/stone4.jpg',
						normalMapUrl: baseUrl + '/floor/maps/stone4.jpg',
						mapPar:{
							repeat: {x: 50, y: 50}
						},
					}
				},
				stone5: {
					main:{
						mapUrl: baseUrl + '/floor/stone5.jpg',
						normalMapUrl: baseUrl + '/floor/maps/stone5.jpg',
						mapPar:{
							repeat: {x: 50, y: 50}
						},
					}
				},
				stone6: {
					main:{
						mapUrl: baseUrl + '/floor/stone6.jpg',
						normalMapUrl: baseUrl + '/floor/maps/stone6.jpg',
						mapPar:{
							repeat: {x: 50, y: 50}
						},
					}
				},
				stone7: {
					main:{
						mapUrl: baseUrl + '/floor/stone7.jpg',
						normalMapUrl: baseUrl + '/floor/maps/stone7.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				timber2: {
					main:{
						mapUrl: baseUrl + '/floor/timber2.jpg',
						normalMapUrl: baseUrl + '/floor/maps/timber2.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				timber3: {
					main:{
						mapUrl: baseUrl + '/floor/timber3.jpg',
						normalMapUrl: baseUrl + '/floor/maps/timber3.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				timber4: {
					main:{
						mapUrl: baseUrl + '/floor/timber4.jpg',
						normalMapUrl: baseUrl + '/floor/maps/timber4.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				timber5: {
					main:{
						mapUrl: baseUrl + '/floor/timber5.jpg',
						normalMapUrl: baseUrl + '/floor/maps/timber5.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				road_brick: {
					main:{
						mapUrl: baseUrl + '/floor/road_brick.jpg',
						normalMapUrl: baseUrl + '/floor/maps/road_brick.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				road_brick2: {
					main:{
						mapUrl: baseUrl + '/floor/road_brick2.jpg',
						normalMapUrl: baseUrl + '/floor/maps/road_brick2.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				},
				road_brick3: {
					main:{
						mapUrl: baseUrl + '/floor/road_brick3.jpg',
						normalMapUrl: baseUrl + '/floor/maps/road_brick3.jpg',
						mapPar:{
							repeat: {x: 20, y: 20}
						},
					}
				}
			}
		},
		wall:{
			main: {
				dynamicColor: true
			},
			textures:{
				painted: {
					main:{
						matPar:{
							metalness: 0.1,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				brick_01: {
					main:{
						mapUrl: baseUrl + '/walls/brick_01.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_01.jpg',
						mapPar:{
							repeat: { x: 4.5, y:  4.5 },
							normalScale: {x: 0.5, y: 0.5},
						},
						matPar:{
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				brick_02: {
					main:{
						mapUrl: baseUrl + '/walls/brick_02.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_02.jpg',
						mapPar:{
							repeat: { x: 4.5, y:  4.5 },
							normalScale: {x: 0.5, y: 0.5},
						},
						matPar: {
							metalness: 0.25,					
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				brick_03: {
					main:{
						mapUrl: baseUrl + '/walls/brick_03.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_03.jpg',
						mapPar:{
							repeat: { x: 4, y:  4 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				brick_04: {
					main:{
						mapUrl: baseUrl + '/walls/brick_04.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_04.jpg',
						mapPar:{
							repeat: { x: 6, y:  6 },
							normalScale: {x: -0.2, y: 0.5},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				brick_05: {
					main:{
						mapUrl: baseUrl + '/walls/brick_05.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_05.jpg',
						mapPar:{
							repeat: { x: 4, y:  4 },
							normalScale: {x: 0.2, y: 0.2},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				brick_06: {
					main:{
						mapUrl: baseUrl + '/walls/brick_06.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_06.jpg',
						mapPar:{
							repeat: { x: 2.5, y:  3 },
							normalScale: {x: -0.5, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						},
					}
				},
				brick_07: {
					main:{
						mapUrl: baseUrl + '/walls/brick_07.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_07.jpg',
						mapPar:{
							repeat: { x: 2.7, y:  3.2 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				brick_08: {
					main:{
						mapUrl: baseUrl + '/walls/brick_08.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_08.jpg',
						mapPar:{
							repeat: { x: 3, y:  3 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				brick_09: {
					main:{
						mapUrl: baseUrl + '/walls/brick_09.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_09.jpg',
						mapPar:{
							repeat: { x: 4, y:  3 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				brick_10: {
					main:{
						mapUrl: baseUrl + '/walls/brick_10.jpg',
						normalMapUrl: baseUrl + '/walls/maps/brick_10.jpg',
						mapPar:{
							repeat: { x: 3, y:  3 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				concrete2: {
					main:{
						mapUrl: baseUrl + '/walls/concrete2.jpg',
						normalMapUrl: baseUrl + '/walls/maps/concrete2.jpg',
						mapPar:{
							repeat: { x: 3, y:  3 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},	
				concrete3: {
					main:{
						mapUrl: baseUrl + '/walls/concrete3.jpg',
						normalMapUrl: baseUrl + '/walls/maps/concrete3.jpg',
						mapPar:{
							repeat: { x: 4, y:  6 },
							normalScale: {x: 5, y: 2},
						},
						matPar:{
							metalness: 0.2,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},
				concrete4: {
					main:{
						mapUrl: baseUrl + '/walls/concrete4.jpg',
						normalMapUrl: baseUrl + '/walls/maps/concrete4.jpg',
						mapPar:{
							repeat: { x: 2, y:  3 },
							normalScale: {x: -3, y: -2},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.9,
							bumpScale: 5
						}
					}
				},	
				concrete5: {
					main:{
						mapUrl: baseUrl + '/walls/concrete5.jpg',
						normalMapUrl: baseUrl + '/walls/maps/concrete5.jpg',
						mapPar:{
							repeat: { x: 3, y:  5 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,					
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},	
				concrete6: {
					main:{
						mapUrl: baseUrl + '/walls/concrete6.jpg',
						normalMapUrl: baseUrl + '/walls/maps/concrete6.jpg',
						mapPar:{
							repeat: { x: 1, y:  2 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},	
				concrete: {
					main:{
						mapUrl: baseUrl + '/walls/concrete.jpg',
						normalMapUrl: baseUrl + '/walls/maps/concrete.jpg',
						mapPar:{
							repeat: { x: 2, y:  3 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},		
				plitka_13: {
					main:{
						mapUrl: baseUrl + '/walls/plitka_13.jpg',
						normalMapUrl: baseUrl + '/walls/maps/plitka_13.jpg',
						mapPar:{
							repeat: { x: 2, y:  4 },
							normalScale: {x: -1, y: 1},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				shtukaturka_1: {
					main:{
						mapUrl: baseUrl + '/walls/shtukaturka_1.jpg',
						normalMapUrl: baseUrl + '/floor/walls/shtukaturka_1.jpg',
						mapPar:{
							repeat: { x: 1, y:  2.5 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},	
				shtukaturka_2: {
					main:{
						mapUrl: baseUrl + '/walls/shtukaturka_2.jpg',
						normalMapUrl: baseUrl + '/floor/walls/shtukaturka_2.jpg',
						mapPar:{
							repeat: { x: 2.5, y:  5 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				shtukaturka_3: {
					main:{
						mapUrl: baseUrl + '/walls/shtukaturka_3.jpg',
						normalMapUrl: baseUrl + '/floor/walls/shtukaturka_3.jpg',
						mapPar:{
							repeat: { x: 1, y:  2 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},	
				shtukaturka_4: {
					main:{
						mapUrl: baseUrl + '/walls/shtukaturka_4.jpg',
						normalMapUrl: baseUrl + '/floor/walls/shtukaturka_4.jpg',
						mapPar:{
							repeat: { x: 1, y:  4 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.7,
							bumpScale: 5
						}
					}
				},	
				timber_1: {
					main:{
						mapUrl: baseUrl + '/walls/timber_1.jpg',
						normalMapUrl: baseUrl + '/walls/maps/timber_1.jpg',
						mapPar:{
							repeat: { x: 1, y:  2 },
							normalScale: {x: 5, y: -3},
						},
						matPar:{
							metalness: 0.3,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},
				wallPaper_01: {
					main:{
						mapUrl: baseUrl + '/walls/wallPaper_01.jpg',
						mapPar:{
							repeat: { x: 5, y:  5 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.2,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},
				wallPaper_03: {
					main:{
						mapUrl: baseUrl + '/walls/wallPaper_03.jpg',
						mapPar:{
							repeat: { x: 2, y:  3 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},
				wallPaper_02: {
					main:{
						mapUrl: baseUrl + '/walls/wallPaper_02.jpg',
						mapPar:{
							repeat: { x: 2, y:  5 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.9,
							bumpScale: 5
						}
					}
				},
				wallPaper_04: {
					main:{
						mapUrl: baseUrl + '/walls/wallPaper_04.jpg',
						mapPar:{
							repeat: { x: 1.5, y:  2.5 },
							normalScale: {x: 0.2, y: 0.2},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.9,
							bumpScale: 5
						}
					}
				},
				wallPaper_05: {
					main:{
						mapUrl: baseUrl + '/walls/wallPaper_05.jpg',
						mapPar:{
							repeat: { x: 1.5, y:  7.5 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.6,
							bumpScale: 5
						}
					}
				},
				wallPaper_07: {
					main:{
						mapUrl: baseUrl + '/walls/wallPaper_07.jpg',
						mapPar:{
							repeat: { x: 2, y:  4 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.9,
							bumpScale: 5
						}
					}
				},
				wallPaper_08: {
					main:{
						mapUrl: baseUrl + '/walls/wallPaper_08.jpg',
						mapPar:{
							repeat: { x: 1.5, y:  3 },
							normalScale: {x: 5, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.8,
							bumpScale: 5
						}
					}
				},
				wallPaper_09: {
					main:{
						mapUrl: baseUrl + '/walls/wallPaper_09.jpg',
						mapPar:{
							repeat: { x: 3, y:  6 },
							normalScale: {x: 5, y: 10},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.9,
							bumpScale: 5
						}
					}
				},
				wallPaper_10: {
					main:{
						mapUrl: baseUrl + '/walls/wallPaper_10.jpg',
						mapPar:{
							repeat: { x: 2, y:  5 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.9,
							bumpScale: 5
						}
					}
				},
				timber_2: {
					main:{
						mapUrl: baseUrl + '/walls/timber_2.jpg',
						normalMapUrl: baseUrl + '/walls/maps/timber_2.jpg',
						mapPar:{
							repeat: { x: 1, y:  2 },
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.25,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.9,
							bumpScale: 5
						}
					}
				},
				paint: {
					main:{
						mapUrl: baseUrl + '/walls/paint.jpg',
						normalMapUrl: baseUrl + '/walls/maps/paint.jpg',
						mapPar:{
							repeat: {x: 1/100, y: 2/100},
							normalScale: {x: 1, y: 1},
						},
						matPar:{
							metalness: 0.01,
							reflectivity: 0.5,
							refractionRatio: 1,
							roughness: 0.9,
							bumpScale: 5
						}
					}
				},
		
			}
		},
		wireframe:{
			main:{dynamicColor: true},
			textures:{wireframe:{}}
		}
	};

	var options = $('#treadsColor option');
	var timberColors = $.map(options ,function(option) {
		return option.value;
	});

	// Загружаем цвета для дерева
	$.each(config.timber.textures, function(){
		var texture = this;
		timberColors.forEach(function(color){
			if (!texture.colors) texture.colors = {};
			if (!texture.colors[color]) texture.colors[color] = {};
			if (!texture.colors[color].main) texture.colors[color].main = {};
			if (!texture.colors[color].main.matPar) texture.colors[color].main.matPar = {};
			if (!texture.colors[color].main.matPar.color) texture.colors[color].main.matPar.color = new THREE.Color(getTimberColorId(color));
		});
	});

	var options = $('#carcasColor option');
	var metalColors = $.map(options ,function(option) {
		return option.value;
	});

	$.each(config.metal.textures, function(){
		var texture = this;
		metalColors.forEach(function(color){
			if (!texture.colors) texture.colors = {};
			if (!texture.colors[color]) texture.colors[color] = {};
			if (!texture.colors[color].main) texture.colors[color].main = {};
			if (!texture.colors[color].main.matPar) texture.colors[color].main.matPar = {};
			if (!texture.colors[color].main.matPar.color) texture.colors[color].main.matPar.color = new THREE.Color(getMetalColorId(color));
		});
	});

	// Цвета для поликарбоната
	if ($('#roofPlastColor').length > 0) {
		var options = $('#roofPlastColor option');
		var roofPlastColors = $.map(options ,function(option) {
			return option.value;
		});

		$.each(config.plastic_roof.textures, function(){
			var texture = this;
			roofPlastColors.forEach(function(color){
				if (!texture.colors) texture.colors = {};
				if (!texture.colors[color]) texture.colors[color] = {};
				if (!texture.colors[color].main) texture.colors[color].main = {};
				if (!texture.colors[color].main.matPar) texture.colors[color].main.matPar = {};
				if (!texture.colors[color].main.matPar.color) texture.colors[color].main.matPar.color = new THREE.Color(getPlasticColorId(color));
			});
		});
	}
	
	// Цвета для профнастила
	if ($('#roofMetalColor').length > 0) {
		var options = $('#roofMetalColor option');
		var roofMetalColors = $.map(options ,function(option) {
			return option.value;
		});

		$.each(config.metal_roof.textures, function(){
			var texture = this;
			roofMetalColors.forEach(function(color){
				if (!texture.colors) texture.colors = {};
				if (!texture.colors[color]) texture.colors[color] = {};
				if (!texture.colors[color].main) texture.colors[color].main = {};
				if (!texture.colors[color].main.matPar) texture.colors[color].main.matPar = {};
				if (!texture.colors[color].main.matPar.color) texture.colors[color].main.matPar.color = new THREE.Color(getMetalColorId(color));
			});
		});
	}

	return config;
}

function getMaterialsConfigs2(){
	var textureParams = {
		groupConfigs:{
			timber: {
				metalness: 0.1,
				roughness: 0.48,
				bumpScale: 0.1,
				opacity: 1.0
			},
			glass: {
				opacity: 0.5,
				metalness: 0.8,
				roughness: 0.1,
				color: new THREE.Color(0xCBF8F2),
				transparent: true,
				combine: THREE.MultiplyOperation,
				reflectivity: 1.0,
			},
			chrome: {
				color: new THREE.Color(0xFFFFFF),
				specular: new THREE.Color(0xABABAB),
				combine: THREE.MultiplyOperation,
				shininess: 50,
				reflectivity: 1,
				metalness: 0.7,
				roughness: 0,
				opacity: 1.0
			},
			metal: {
				metalness: 0.5,
				roughness: 0.3,
				bumpScale: 0.1,
				reflectivity: 1,
				envMapIntensity: 0.8,
				opacity: 1.0
			},
			floor: {
				metalness: 0.1,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.9,
				opacity: 1.0
			},
			walls: {
				metalness: 0.1,
				reflectivity: 0.5,
				refractionRatio: 1,
				roughness: 0.7,
				bumpScale: 5,
				opacity: 1.0
			},
			default: {
				metalness: 0.1,
				roughness: 0.48,
				bumpScale: 0.1,
				opacity: 1.0
			}
		},
		tread: getTreadMatConfig(),
		timber: getTimberMatConfig(),
		timber2: getTimberMatConfig(),
		riser: getTimberMatConfig(),
		additionalObjectTimber: getTimberMatConfig(),
		additionalObjectMetal: getMetalMatConfig(),
		skirting: getTimberMatConfig(),
		newell: getTimberMatConfig(),
		handrail: getTimberMatConfig(),
		bal: getTimberMatConfig(),
		metal: getMetalMatConfig(),
		metal2: getMetalMatConfig(),
		metal_railing: getMetalMatConfig(),
		stringer_cover:getMetalMatConfig(),
		floor: getFloorMatConfig('bot'),
		floor2: getFloorMatConfig('top'),
		ceil: getWallMatConfig(),
		walls: getWallMatConfig(),
	};
	

	return textureParams;
}

function getMetalMatConfig(color){
	var config = {
		metal: {
			mapUrl: baseUrl + '/metal/metal.jpg',
			normalMapUrl: baseUrl + '/metal/maps/metal.jpg',
			mapPar:{
				repeat: {x: 1/200, y: 1/200},
				offset: {x: 0.1, y: 0.1},
			},
			matPar:{
				normalScale: {x: 1, y: -1}
			}
		},
		"нет": {},
		"не указано": {},
		"светло-серый": {},
		"темно-серый": {},
		"коричневый": {},
		"черный": {},
		"черный матовый": {},
		"белый": {},
		"бежевый": {},
		"медный антик": {},
		"белое серебро": {},
		"черное серебро": {},
		"черная ящерица": {},
		"бежевая ящерица": {},
		"коричневая ящерица": {},
	};
	

	return config;
}

function getFloorMatConfig(floorName){
	var config = {
		painted: {
			matPar:{
				metalness: 0.5,
				reflectivity: 0.5,
				refractionRatio: 1,
				roughness: 0.7,
				bumpScale: 5
			}
		},
		carpet: {
			mapUrl: baseUrl + '/floor/carpet.jpg',
			normalMapUrl: baseUrl + '/floor/maps/carpet.jpg',
			mapPar:{
				repeat: {x: 20, y: 20},
				metalness: 0.1,
			},
			matPar:{
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.9
			}
		},
		carpet_2: {
			mapUrl: baseUrl + '/floor/carpet_2.jpg',
			normalMapUrl: baseUrl + '/floor/maps/carpet_2.jpg',
			mapPar:{
				repeat: {x: 20, y: 20},
			},
			matPar:{
				metalness: 0.1,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.9
			}
		},
		carpet_3: {
			mapUrl: baseUrl + '/floor/carpet_3.jpg',
			normalMapUrl: baseUrl + '/floor/maps/carpet_3.jpg',
			mapPar:{
				repeat: {x: 20, y: 20},
			},
			matPar:{
				metalness: 0.1,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.9
			}
		},
		carpet_4: {
			mapUrl: baseUrl + '/floor/carpet_4.jpg',
			normalMapUrl: baseUrl + '/floor/maps/carpet_4.jpg',
			mapPar:{
				repeat: {x: 20, y: 20},
			},
			matPar:{
				metalness: 0.2,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 1
			}
		},
		carpet_5: {
			mapUrl: baseUrl + '/floor/carpet_5.jpg',
			normalMapUrl: baseUrl + '/floor/maps/carpet_5.jpg',
			mapPar:{
				repeat: {x: 30, y: 30},
			},
			matPar:{
				metalness: 0.2,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 1,
				bumpScale: 5
			}
		},
		laminat_1: {
			mapUrl: baseUrl + '/floor/laminat_1.jpg',
			normalMapUrl: baseUrl + '/floor/maps/laminat_1.jpg',
			mapPar:{
				repeat: {x: 6, y: 10},
			},
			matPar:{
				metalness: 0.3,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.7,
				bumpScale: 5
			}
		},
		laminat_2: {
			mapUrl: baseUrl + '/floor/laminat_2.jpg',
			normalMapUrl: baseUrl + '/floor/maps/laminat_2.jpg',
			mapPar:{
				repeat: {x: 6, y: 10},
			},
			matPar:{
				metalness: 0.3,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.7,
				bumpScale: 5
			}
		},
		laminat_3: {
			mapUrl: baseUrl + '/floor/laminat_3.jpg',
			normalMapUrl: baseUrl + '/floor/maps/laminat_3.jpg',
			mapPar:{
				repeat: {x: 6, y: 10},
			},
			matPar:{
				metalness: 0.3,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.7,
				bumpScale: 5
			}
		},
		laminat_4: {
			mapUrl: baseUrl + '/floor/laminat_4.jpg',
			normalMapUrl: baseUrl + '/floor/maps/laminat_4.jpg',
			mapPar:{
				repeat: {x: 6, y: 10},
			},
			matPar:{
				metalness: 0.3,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.7,
				bumpScale: 5
			}
		},
		laminat_5: {
			mapUrl: baseUrl + '/floor/laminat_5.jpg',
			normalMapUrl: baseUrl + '/floor/maps/laminat_5.jpg',
			mapPar:{
				repeat: {x: 6, y: 10},
			},
			matPar:{
				metalness: 0.3,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.7,
				bumpScale: 5
			}
		},
		laminat_7: {
			mapUrl: baseUrl + '/floor/laminat_7.jpg',
			normalMapUrl: baseUrl + '/floor/maps/laminat_7.jpg',
			mapPar:{
				repeat: {x: 6, y: 8},
			},
			matPar:{
				metalness: 0.3,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.7,
				bumpScale: 5
			}
		},
		marf_10: {
			mapUrl: baseUrl + '/floor/marf_10.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_10.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		marf_1: {
			mapUrl: baseUrl + '/floor/marf_1.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_1.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		marf_2: {
			mapUrl: baseUrl + '/floor/marf_2.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_2.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		marf_3: {
			mapUrl: baseUrl + '/floor/marf_3.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_3.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		marf_4: {
			mapUrl: baseUrl + '/floor/marf_4.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_4.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		marf_5: {
			mapUrl: baseUrl + '/floor/marf_5.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_5.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		marf_6: {
			mapUrl: baseUrl + '/floor/marf_6.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_6.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		marf_7: {
			mapUrl: baseUrl + '/floor/marf_7.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_7.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		marf_8: {
			mapUrl: baseUrl + '/floor/marf_8.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_8.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		marf_9: {
			mapUrl: baseUrl + '/floor/marf_9.jpg',
			normalMapUrl: baseUrl + '/floor/maps/marf_9.jpg',
			mapPar:{
				repeat: {x: 10, y: 12},
				normalScale: {x: 0.05, y: 0.05},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		plitka_10: {
			mapUrl: baseUrl + '/floor/plitka_10.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_10.jpg',
			mapPar:{
				repeat: {x: 15, y: 15},
				normalScale: {x: 0.8, y: 0.8},
			},
			matPar:{
				metalness: 0.3,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.1,
				bumpScale: 5
			}
		},
		plitka_11: {
			mapUrl: baseUrl + '/floor/plitka_11.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_11.jpg',
			mapPar:{
				repeat: {x: 30, y: 30},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.4,					
				reflectivity: 1,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		plitka_12: {
			mapUrl: baseUrl + '/floor/plitka_12.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_12.jpg',
			mapPar:{
				repeat: {x: 30, y: 30},
				normalScale: {x: 2, y: 3},
			},
			matPar:{
				metalness: 0.3,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.05,
				bumpScale: 5
			}
		},
		plitka_13: {
			mapUrl: baseUrl + '/floor/plitka_13.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_13.jpg',
			mapPar:{
				repeat: {x: 17, y: 17},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.4,					
				reflectivity: 0.6,
				refractionRatio: 0,
				roughness: 0.7,
				bumpScale: 5
			}
		},
		plitka_1: {
			mapUrl: baseUrl + '/floor/plitka_1.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_1.jpg',
			mapPar:{
				repeat: {x: 15, y: 15},
				normalScale: {x: 0.5, y: 0.1},
			},
			matPar:{
				metalness: 0.3,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		plitka_3: {
			mapUrl: baseUrl + '/floor/plitka_3.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_3.jpg',
			mapPar:{
				repeat: {x: 12, y: 12},
				normalScale: {x: 5, y: 5},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0,
				refractionRatio: 0,
				roughness: 0.8,
				bumpScale: 5
			}
		},
		plitka_4: {
			mapUrl: baseUrl + '/floor/plitka_4.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_4.jpg',
			mapPar:{
				repeat: {x: 9, y: 9},
				normalScale: {x: -0.5, y: 0.5},
			},
			matPar:{
				metalness: 0.35,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		plitka_5: {
			mapUrl: baseUrl + '/floor/plitka_5.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_5.jpg',
			mapPar:{
				repeat: {x: 10, y: 10},
				normalScale: {x: 0.5, y: 0.3},
			},
			matPar:{
				metalness: 0.35,
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		plitka_6: {
			mapUrl: baseUrl + '/floor/plitka_6.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_6.jpg',
			mapPar:{
				repeat: {x: 25, y: 25},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		plitka_7: {
			mapUrl: baseUrl + '/floor/plitka_7.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_7.jpg',
			mapPar:{
				repeat: {x: 25, y: 25},
				normalScale: {x: 3, y: 5},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		plitka_8: {
			mapUrl: baseUrl + '/floor/plitka_8.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_8.jpg',
			mapPar:{
				repeat: {x: 25, y: 25},
				normalScale: {x: 3, y: 5},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.8,
				bumpScale: 5
			}
		},
		plitka_9: {
			mapUrl: baseUrl + '/floor/plitka_9.jpg',
			normalMapUrl: baseUrl + '/floor/maps/plitka_9.jpg',
			mapPar:{
				repeat: {x: 25, y: 25},
				normalScale: {x: 0.5, y: 1},
			},
			matPar:{
				metalness: 0.3,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		road_brick: {
			mapUrl: baseUrl + '/floor/road_brick.jpg',
			normalMapUrl: baseUrl + '/floor/maps/road_brick.jpg',
			mapPar:{
				repeat: {x: 25, y: 25},
				normalScale: {x: 1, y: 3},
			},
			matPar:{
				metalness: 0.3,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.8,
				bumpScale: 5
			}
		},
		road_brick_04: {
			mapUrl: baseUrl + '/floor/road_brick_04.jpg',
			normalMapUrl: baseUrl + '/floor/maps/road_brick_04.jpg',
			mapPar:{
				repeat: {x: 14, y: 17},
				normalScale: {x: -1, y: 1},
			},
			matPar:{
				metalness: 0.3,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.8,
				bumpScale: 5
			}
		},
		road_brick_05: {
			mapUrl: baseUrl + '/floor/road_brick_05.jpg',
			normalMapUrl: baseUrl + '/floor/maps/road_brick_05.jpg',
			mapPar:{
				repeat: {x: 22, y: 20},
				normalScale: {x: 2, y: 4},
			},
			matPar:{
				metalness: 0.3,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.8,
				bumpScale: 5
			}
		},
		road_brick_06: {
			mapUrl: baseUrl + '/floor/road_brick_06.jpg',
			normalMapUrl: baseUrl + '/floor/maps/road_brick_06.jpg',
			mapPar:{
				repeat: {x: 12, y: 12},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.3,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.7,
				bumpScale: 5
			}
		},
		wood_10: {
			mapUrl: baseUrl + '/floor/wood_10.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_10.jpg',
			mapPar:{
				repeat: {x: 15, y: 10},
				normalScale: {x: -1, y: -0.5},
			},
			matPar:{
				metalness: 0.22,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.9,
				bumpScale: 5
			}
		},
		wood_11: {
			mapUrl: baseUrl + '/floor/wood_11.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_11.jpg',
			mapPar:{
				repeat: {x: 35, y: 35},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		wood_12: {
			mapUrl: baseUrl + '/floor/wood_12.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_12.jpg',
			mapPar:{
				repeat: {x: 40, y: 40},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		wood_14: {
			mapUrl: baseUrl + '/floor/wood_14.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_14.jpg',
			mapPar:{
				repeat: {x: 40, y: 48},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		wood_15: {
			mapUrl: baseUrl + '/floor/wood_15.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_15.jpg',
			mapPar:{
				repeat: {x: 35, y: 35},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.65,
				bumpScale: 5
			}
		},
		wood_1: {
			mapUrl: baseUrl + '/floor/wood_1.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_1.jpg',
			mapPar:{
				repeat: {x: 15, y: 17},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.2,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.6,
				bumpScale: 5
			}
		},
		wood_2: {
			mapUrl: baseUrl + '/floor/wood_2.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_2.jpg',
			mapPar:{
				repeat: {x: 10, y: 8},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.2,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.65,
				bumpScale: 5
			}
		},
		wood_3: {
			mapUrl: baseUrl + '/floor/wood_3.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_3.jpg',
			mapPar:{
				repeat: {x: 10, y: 8},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.2,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.65,
				bumpScale: 5
			}
		},	
		wood_4: {
			mapUrl: baseUrl + '/floor/wood_4.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_4.jpg',
			mapPar:{
				repeat: {x: 8, y: 10},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.65,
				bumpScale: 5
			}
		},
		wood_5: {
			mapUrl: baseUrl + '/floor/wood_5.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_5.jpg',
			mapPar:{
				repeat: {x: 8, y: 10},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.65,
				bumpScale: 5
			}
		},	
		wood_6: {
			mapUrl: baseUrl + '/floor/wood_6.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_6.jpg',
			mapPar:{
				repeat: {x: 8, y: 10},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.65,
				bumpScale: 5
			}
		},
		wood_7: {
			mapUrl: baseUrl + '/floor/wood_7.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_7.jpg',
			mapPar:{
				repeat: {x: 8, y: 10},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.7,
				bumpScale: 5
			}
		},	
		wood_8: {
			mapUrl: baseUrl + '/floor/wood_8.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_8.jpg',
			mapPar:{
				repeat: {x: 8, y: 10},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.65,
				bumpScale: 5
			}
		},
		wood_9: {
			mapUrl: baseUrl + '/floor/wood_9.jpg',
			normalMapUrl: baseUrl + '/floor/maps/wood_9.jpg',
			mapPar:{
				repeat: {x: 8 / 1.2, y: 10 / 1.2},
				normalScale: {x: 1, y: 1},
			},
			matPar:{
				metalness: 0.25,					
				reflectivity: 0.5,
				refractionRatio: 0,
				roughness: 0.65,
				bumpScale: 5
			}
		},
		tiling: {
			mapUrl: baseUrl + '/floor/tiling.jpg',
			normalMapUrl: baseUrl + '/floor/maps/tiling.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		stone: {
			mapUrl: baseUrl + '/floor/stone.jpg',
			normalMapUrl: baseUrl + '/floor/maps/stone.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		stone2: {
			mapUrl: baseUrl + '/floor/stone2.jpg',
			normalMapUrl: baseUrl + '/floor/maps/stone2.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		stone3: {
			mapUrl: baseUrl + '/floor/stone3.jpg',
			normalMapUrl: baseUrl + '/floor/maps/stone3.jpg',
			mapPar:{
				repeat: {x: 50, y: 50}
			},
		},
		stone4: {
			mapUrl: baseUrl + '/floor/stone4.jpg',
			normalMapUrl: baseUrl + '/floor/maps/stone4.jpg',
			mapPar:{
				repeat: {x: 50, y: 50}
			},
		},
		stone5: {
			mapUrl: baseUrl + '/floor/stone5.jpg',
			normalMapUrl: baseUrl + '/floor/maps/stone5.jpg',
			mapPar:{
				repeat: {x: 50, y: 50}
			},
		},
		stone6: {
			mapUrl: baseUrl + '/floor/stone6.jpg',
			normalMapUrl: baseUrl + '/floor/maps/stone6.jpg',
			mapPar:{
				repeat: {x: 50, y: 50}
			},
		},
		stone7: {
			mapUrl: baseUrl + '/floor/stone7.jpg',
			normalMapUrl: baseUrl + '/floor/maps/stone7.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		timber2: {
			mapUrl: baseUrl + '/floor/timber2.jpg',
			normalMapUrl: baseUrl + '/floor/maps/timber2.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		timber3: {
			mapUrl: baseUrl + '/floor/timber3.jpg',
			normalMapUrl: baseUrl + '/floor/maps/timber3.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		timber4: {
			mapUrl: baseUrl + '/floor/timber4.jpg',
			normalMapUrl: baseUrl + '/floor/maps/timber4.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		timber5: {
			mapUrl: baseUrl + '/floor/timber5.jpg',
			normalMapUrl: baseUrl + '/floor/maps/timber5.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		road_brick: {
			mapUrl: baseUrl + '/floor/road_brick.jpg',
			normalMapUrl: baseUrl + '/floor/maps/road_brick.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		road_brick2: {
			mapUrl: baseUrl + '/floor/road_brick2.jpg',
			normalMapUrl: baseUrl + '/floor/maps/road_brick2.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		},
		road_brick3: {
			mapUrl: baseUrl + '/floor/road_brick3.jpg',
			normalMapUrl: baseUrl + '/floor/maps/road_brick3.jpg',
			mapPar:{
				repeat: {x: 20, y: 20}
			},
		}
	}
	
	//копируем базовый масштаб
	$.each(config, function(){
		if(this.mapPar && this.mapPar.repeat){
			this.mapPar.repeat_def = {x: this.mapPar.repeat.x, y: this.mapPar.repeat.y};
		};
	})
	
	//непонятный костыль чтобы был нормальный масштаб текстуры верхнего перекрытия
	console.log(floorName)
	if(floorName == "top") {
		$.each(config, function(){
			if(this.mapPar && this.mapPar.repeat){
				this.mapPar.repeat.x *= 0.00005;
				this.mapPar.repeat.y *= 0.00005;
			};
		})
		
		
	}
	
	return config
	
}

function getWallMatConfig(){
	var config =  {
			painted: {
				main:{
					matPar:{
						metalness: 0.1,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			brick_01: {
				main:{
					mapUrl: baseUrl + '/walls/brick_01.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_01.jpg',
					mapPar:{
						repeat: { x: 4.5, y:  4.5 },
						normalScale: {x: 0.5, y: 0.5},
					},
					matPar:{
						metalness: 0.25,					
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			brick_02: {
				main:{
					mapUrl: baseUrl + '/walls/brick_02.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_02.jpg',
					mapPar:{
						repeat: { x: 4.5, y:  4.5 },
						normalScale: {x: 0.5, y: 0.5},
					},
					matPar: {
						metalness: 0.25,					
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			brick_03: {
				main:{
					mapUrl: baseUrl + '/walls/brick_03.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_03.jpg',
					mapPar:{
						repeat: { x: 4, y:  4 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			brick_04: {
				main:{
					mapUrl: baseUrl + '/walls/brick_04.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_04.jpg',
					mapPar:{
						repeat: { x: 6, y:  6 },
						normalScale: {x: -0.2, y: 0.5},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			brick_05: {
				main:{
					mapUrl: baseUrl + '/walls/brick_05.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_05.jpg',
					mapPar:{
						repeat: { x: 4, y:  4 },
						normalScale: {x: 0.2, y: 0.2},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			brick_06: {
				main:{
					mapUrl: baseUrl + '/walls/brick_06.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_06.jpg',
					mapPar:{
						repeat: { x: 2.5, y:  3 },
						normalScale: {x: -0.5, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					},
				}
			},
			brick_07: {
				main:{
					mapUrl: baseUrl + '/walls/brick_07.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_07.jpg',
					mapPar:{
						repeat: { x: 2.7, y:  3.2 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			brick_08: {
				main:{
					mapUrl: baseUrl + '/walls/brick_08.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_08.jpg',
					mapPar:{
						repeat: { x: 3, y:  3 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			brick_09: {
				main:{
					mapUrl: baseUrl + '/walls/brick_09.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_09.jpg',
					mapPar:{
						repeat: { x: 4, y:  3 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			brick_10: {
				main:{
					mapUrl: baseUrl + '/walls/brick_10.jpg',
					normalMapUrl: baseUrl + '/walls/maps/brick_10.jpg',
					mapPar:{
						repeat: { x: 3, y:  3 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			concrete2: {
				main:{
					mapUrl: baseUrl + '/walls/concrete2.jpg',
					normalMapUrl: baseUrl + '/walls/maps/concrete2.jpg',
					mapPar:{
						repeat: { x: 3, y:  3 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},	
			concrete3: {
				main:{
					mapUrl: baseUrl + '/walls/concrete3.jpg',
					normalMapUrl: baseUrl + '/walls/maps/concrete3.jpg',
					mapPar:{
						repeat: { x: 4, y:  6 },
						normalScale: {x: 5, y: 2},
					},
					matPar:{
						metalness: 0.2,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},
			concrete4: {
				main:{
					mapUrl: baseUrl + '/walls/concrete4.jpg',
					normalMapUrl: baseUrl + '/walls/maps/concrete4.jpg',
					mapPar:{
						repeat: { x: 2, y:  3 },
						normalScale: {x: -3, y: -2},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.9,
						bumpScale: 5
					}
				}
			},	
			concrete5: {
				main:{
					mapUrl: baseUrl + '/walls/concrete5.jpg',
					normalMapUrl: baseUrl + '/walls/maps/concrete5.jpg',
					mapPar:{
						repeat: { x: 3, y:  5 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.3,					
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.8,
						bumpScale: 5
					}
				}
			},	
			concrete6: {
				main:{
					mapUrl: baseUrl + '/walls/concrete6.jpg',
					normalMapUrl: baseUrl + '/walls/maps/concrete6.jpg',
					mapPar:{
						repeat: { x: 1, y:  2 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.8,
						bumpScale: 5
					}
				}
			},	
			concrete: {
				main:{
					mapUrl: baseUrl + '/walls/concrete.jpg',
					normalMapUrl: baseUrl + '/walls/maps/concrete.jpg',
					mapPar:{
						repeat: { x: 2, y:  3 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},		
			plitka_13: {
				main:{
					mapUrl: baseUrl + '/walls/plitka_13.jpg',
					normalMapUrl: baseUrl + '/walls/maps/plitka_13.jpg',
					mapPar:{
						repeat: { x: 2, y:  4 },
						normalScale: {x: -1, y: 1},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.6,
						bumpScale: 5
					}
				}
			},
			shtukaturka_1: {
				main:{
					mapUrl: baseUrl + '/walls/shtukaturka_1.jpg',
					normalMapUrl: baseUrl + '/floor/walls/shtukaturka_1.jpg',
					mapPar:{
						repeat: { x: 1, y:  2.5 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.6,
						bumpScale: 5
					}
				}
			},	
			shtukaturka_2: {
				main:{
					mapUrl: baseUrl + '/walls/shtukaturka_2.jpg',
					normalMapUrl: baseUrl + '/floor/walls/shtukaturka_2.jpg',
					mapPar:{
						repeat: { x: 2.5, y:  5 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.6,
						bumpScale: 5
					}
				}
			},
			shtukaturka_3: {
				main:{
					mapUrl: baseUrl + '/walls/shtukaturka_3.jpg',
					normalMapUrl: baseUrl + '/floor/walls/shtukaturka_3.jpg',
					mapPar:{
						repeat: { x: 1, y:  2 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},	
			shtukaturka_4: {
				main:{
					mapUrl: baseUrl + '/walls/shtukaturka_4.jpg',
					normalMapUrl: baseUrl + '/floor/walls/shtukaturka_4.jpg',
					mapPar:{
						repeat: { x: 1, y:  4 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.7,
						bumpScale: 5
					}
				}
			},	
			timber_1: {
				main:{
					mapUrl: baseUrl + '/walls/timber_1.jpg',
					normalMapUrl: baseUrl + '/walls/maps/timber_1.jpg',
					mapPar:{
						repeat: { x: 1, y:  2 },
						normalScale: {x: 5, y: -3},
					},
					matPar:{
						metalness: 0.3,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.8,
						bumpScale: 5
					}
				}
			},
			wallPaper_01: {
				main:{
					mapUrl: baseUrl + '/walls/wallPaper_01.jpg',
					mapPar:{
						repeat: { x: 5, y:  5 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.2,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.8,
						bumpScale: 5
					}
				}
			},
			wallPaper_03: {
				main:{
					mapUrl: baseUrl + '/walls/wallPaper_03.jpg',
					mapPar:{
						repeat: { x: 2, y:  3 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.8,
						bumpScale: 5
					}
				}
			},
			wallPaper_02: {
				main:{
					mapUrl: baseUrl + '/walls/wallPaper_02.jpg',
					mapPar:{
						repeat: { x: 2, y:  5 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.9,
						bumpScale: 5
					}
				}
			},
			wallPaper_04: {
				main:{
					mapUrl: baseUrl + '/walls/wallPaper_04.jpg',
					mapPar:{
						repeat: { x: 1.5, y:  2.5 },
						normalScale: {x: 0.2, y: 0.2},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.9,
						bumpScale: 5
					}
				}
			},
			wallPaper_05: {
				main:{
					mapUrl: baseUrl + '/walls/wallPaper_05.jpg',
					mapPar:{
						repeat: { x: 1.5, y:  7.5 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.6,
						bumpScale: 5
					}
				}
			},
			wallPaper_07: {
				main:{
					mapUrl: baseUrl + '/walls/wallPaper_07.jpg',
					mapPar:{
						repeat: { x: 2, y:  4 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.9,
						bumpScale: 5
					}
				}
			},
			wallPaper_08: {
				main:{
					mapUrl: baseUrl + '/walls/wallPaper_08.jpg',
					mapPar:{
						repeat: { x: 1.5, y:  3 },
						normalScale: {x: 5, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.8,
						bumpScale: 5
					}
				}
			},
			wallPaper_09: {
				main:{
					mapUrl: baseUrl + '/walls/wallPaper_09.jpg',
					mapPar:{
						repeat: { x: 3, y:  6 },
						normalScale: {x: 5, y: 10},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.9,
						bumpScale: 5
					}
				}
			},
			wallPaper_10: {
				main:{
					mapUrl: baseUrl + '/walls/wallPaper_10.jpg',
					mapPar:{
						repeat: { x: 2, y:  5 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.9,
						bumpScale: 5
					}
				}
			},
			timber_2: {
				main:{
					mapUrl: baseUrl + '/walls/timber_2.jpg',
					normalMapUrl: baseUrl + '/walls/maps/timber_2.jpg',
					mapPar:{
						repeat: { x: 1, y:  2 },
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.25,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.9,
						bumpScale: 5
					}
				}
			},
			paint: {
				main:{
					mapUrl: baseUrl + '/walls/paint.jpg',
					normalMapUrl: baseUrl + '/walls/maps/paint.jpg',
					mapPar:{
						repeat: {x: 1/100, y: 2/100},
						normalScale: {x: 1, y: 1},
					},
					matPar:{
						metalness: 0.01,
						reflectivity: 0.5,
						refractionRatio: 1,
						roughness: 0.9,
						bumpScale: 5
					}
				}
			},
		};
		
	//копируем базовый масштаб
	$.each(config, function(){
		if(this.mapPar && this.mapPar.repeat){
			this.mapPar.repeat_def = {x: this.mapPar.repeat.x, y: this.mapPar.repeat.y};
		};
	})
	
	return config
}

function getTreadTextureName(){
	var stairType = params.stairType;
	if(stairType == "массив" || params.calcType == 'vint') stairType = params.treadsMaterial;
	if (stairType == 'рифленая сталь') {
		return 'rif_metal';
	}else if (stairType == 'стекло') {
		return 'glass';
	}else if (stairType == 'лотки' || stairType == 'лотки под плитку') {
		return 'metal';
	}else if(stairType == 'дпк' || stairType == 'лиственница тер.'){
		return 'dpc';
	}else if(stairType == 'пресснастил'){
		return 'press_metal';
	}else{
		return getTimberTextureName(stairType);
	}
}

function getTimberTextureName(timberType){
	if(timberType == "сосна ц/л кл.Б") return "pine";
	if(timberType == "сосна экстра") return "pine_prem";
	if(timberType == "береза паркет.") return "birch";
	if(timberType == "лиственница паркет.") return "larch";
	if(timberType == "лиственница ц/л") return "larch_prem";
	if(timberType == "дуб паркет.") return "oak";
	if(timberType == "дуб ц/л") return "oak_prem";
	if(timberType == "дуб натур") return "oak_slab";
	if(timberType == "карагач натур") return "elm_slab";
	if(timberType == "шпон") return "oak_veneer";
	return "oak";
}

function getTreadMatConfig(){
	var treadParams = getTimberMatConfig();
	treadParams['rif_metal'] = {
		mapUrl: baseUrl + '/stairs/rif_metal.jpg',
		mapPar:{
			repeat: {x: 1/400, y: 1/400},
			offset: {x: 0.1, y: 0.5},
		}
	};
	treadParams['glass'] = {
		matPar:{
			opacity: 0.5,
			metalness: 0.8,
			roughness: 0.1,
			color: new THREE.Color(0xCBF8F2),
			transparent: true,
			combine: THREE.MultiplyOperation,
			reflectivity: 1.0,
		}
	};
	treadParams['press_metal'] = {
		mapUrl: baseUrl + '/stairs/press_metal.jpg',
		mapPar:{
			repeat: {x: 1/100, y: 1/100},
			offset: {x: 0.1, y: 0.5}
		}
	};
	treadParams['dpc'] = {
		mapUrl: baseUrl + '/stairs/dpc.jpg',
		mapPar:{
			repeat: {x: 1/400, y: 0.00674},
			offset: {x: 0, y: 0}
		}
	};
	return treadParams;
}

function getTimberMatConfig(){
	return {
		pine:{
			mapUrl: baseUrl + '/timber/pine_white.jpg',
			mapPar:{
				repeat: {x: 1/800, y: 1/800},
				offset: {x: 0.1, y: 0.5}
			}
		},
		pine_prem:{
			mapUrl: baseUrl + '/timber/pine_prem_white.jpg',
			mapPar:{
				repeat: {x: 1/1000, y: 1/250},
				offset: {x: 0.1, y: 0.5}
			}
		},
		birch:{
			mapUrl: baseUrl + '/timber/birch_white.jpg',
			mapPar:{
				repeat: {x: 1/1600, y: 1/780},
				offset: {x: 0.1, y: 0.5}
			}
		},
		larch:{
			mapUrl: baseUrl + '/timber/larch_white.jpg',
			mapPar:{
				repeat: {x: 1/1000, y: 1/250},
				offset: {x: 0.1, y: 0.5}
			}
		},
		larch_prem:{
			mapUrl: baseUrl + '/timber/larch_prem_white.jpg',
			mapPar:{
				repeat: {x: 1/1000, y: 1/500},
				offset: {x: 0.1, y: 0.5}
			}
		},
		oak:{
			mapUrl: baseUrl + '/timber/oak_white.jpg',
			mapPar:{
				repeat: {x: 1/1200, y: 1/600},
				offset: {x: 0.1, y: 0.5}
			}
		},
		oak_prem:{
			mapUrl: baseUrl + '/timber/oak_prem_white.jpg',
			mapPar:{
				repeat: {x: 1/2000, y: 1/1000},
				offset: {x: 0.1, y: 0.5}
			}
		},
		elm_slab:{
			main:{
				mapUrl: baseUrl + '/timber/elm_slab_white.jpg',
				mapPar:{
					repeat: {x: 1/2000, y: 1/1000},
					offset: {x: 0.1, y: 0.5}
				}
			}
		},
		oak_slab:{
			main:{
				mapUrl: baseUrl + '/timber/oak_slab_white.jpg',
				mapPar:{
					repeat: {x: 1/2000, y: 1/1000},
					offset: {x: 0.1, y: 0.5}
				}
			}
		},
		oak_veneer:{
			main:{
				mapUrl: baseUrl + '/timber/oak_prem_white.jpg',
				mapPar:{
					repeat: {x: 1/2000, y: 1/1000},
					offset: {x: 0.1, y: 0.5}
				}
			}
		},
	}
}
/** функция возвращает номер hex цвета по его названию
цвета ral взяты отсюда https://rgb.to/ral/3020
*/

function getMetalColorId(colorName){
	var colorId = 0x363636;

	if(colorName == "светло-серый") colorId = 0xD4D4D4
	if(colorName == "темно-серый") colorId = 0x7C7C7C
	if(colorName == "коричневый") colorId = 0x3A1812
	if(colorName == "черный") colorId = 0x222222
	if(colorName == "черный матовый") colorId = 0x222222
	if(colorName == "белый") colorId = 0xFFFFFF
	if(colorName == "бежевый") colorId = 0xECD1C6
	if(colorName == "медный антик") colorId = 0x762D15
	if(colorName == "белое серебро") colorId = 0xDBDBDB
	if(colorName == "черное серебро") colorId = 0x6F6F6F
	if(colorName == "черная ящерица") colorId = 0x111111
	if(colorName == "бежевая ящерица") colorId = 0xECD1C6
	if(colorName == "коричневая ящерица") colorId = 0x762D15
	
	if(colorName == "оцинкованный") colorId = 0xEEEEEE
	if(colorName == "RAL 1014") colorId = 0xddc49a
	if(colorName == "RAL 1015") colorId = 0xe6d2b5
	if(colorName == "RAL 1018") colorId = 0xfaca30
	if(colorName == "RAL 1036") colorId = 0x80643f
	if(colorName == "RAL 2004") colorId = 0xe25303
	if(colorName == "RAL 3003") colorId = 0x861a22
	if(colorName == "RAL 3005") colorId = 0x59191f
	if(colorName == "RAL 3009") colorId = 0x6d342d
	if(colorName == "RAL 3011") colorId = 0x792423
	if(colorName == "RAL 3020") colorId = 0xbb1e10
	if(colorName == "RAL 5002") colorId = 0x00387b
	if(colorName == "RAL 5005") colorId = 0x005387
	if(colorName == "RAL 5021") colorId = 0x007577
	if(colorName == "RAL 6002") colorId = 0x325928
	if(colorName == "RAL 6005") colorId = 0x114232
	if(colorName == "RAL 7004") colorId = 0x9b9b9b
	if(colorName == "RAL 7005") colorId = 0x6c6e6b
	if(colorName == "RAL 7024") colorId = 0x45494e
	if(colorName == "RAL 8017") colorId = 0x442f29
	if(colorName == "RAL 9002") colorId = 0xd7d5cb
	if(colorName == "RAL 9003") colorId = 0xecece7
	if(colorName == "RAL 9006") colorId = 0xa1a1a0
	
	return colorId;
}

function getTimberColorId(colorName){
	//var colorId = 0xE2BD73;
	var colorId = 0xFFE2C1;
	//if(gui.__controllers[0].object.textures || window.location.href.includes('/customers') && window.texturesEnabled) colorId = 0xFFFFFF

	if(colorName == "13-1") colorId = 0xDCD0D0
	if(colorName == "13-2") colorId = 0xF6EAEA
	if(colorName == "72-1") colorId = 0x38352F
	if(colorName == "72-2") colorId = 0x28251F
	if(colorName == "76-1") colorId = 0x3A3130
	if(colorName == "76-2") colorId = 0x2B2221
	if(colorName == "84-1") colorId = 0x634D39
	if(colorName == "84-2") colorId = 0x4E3824
	if(colorName == "87-1") colorId = 0x67493E
	if(colorName == "87-2") colorId = 0x4E3025
	if(colorName == "88-1") colorId = 0x6F5240
	if(colorName == "88-2") colorId = 0x5A3D2B
	if(colorName == "90-1") colorId = 0x6C4C3F
	if(colorName == "90-2") colorId = 0x563629
	if(colorName == "92-1") colorId = 0x6F4E3F
	if(colorName == "92-2") colorId = 0x5B3A2B
	if(colorName == "93-1") colorId = 0xAD734D
	if(colorName == "93-2") colorId = 0x975D37
	if(colorName == "96-1") colorId = 0x534039
	if(colorName == "96-2") colorId = 0x45322B


	if(colorName == "01") colorId = 0xC6B59F //Беленый дуб
	if(colorName == "02") colorId = 0xB49672 //Молочный дуб
	if(colorName == "03") colorId = 0x9A7755 //Теплый серый
	if(colorName == "04") colorId = 0x9C8367 //Холодный серый
	if(colorName == "05") colorId = 0x956D3F //Рустикальный дуб
	if(colorName == "06") colorId = 0xA36A40 //Натуральный бук
	if(colorName == "07") colorId = 0x97684A //Красный орех
	if(colorName == "08") colorId = 0x5F3D1F //Дуб табак
	if(colorName == "09") colorId = 0x6C3811 //Дуб Коньяк
	if(colorName == "10") colorId = 0x945826 //Вишня
	if(colorName == "11") colorId = 0x693D23 //Темный дуб
	if(colorName == "12") colorId = 0xAA5E39 //Темная вишня
	if(colorName == "13") colorId = 0x7A4127 //Махагон
	if(colorName == "14") colorId = 0x73492F //Дуб Антик
	if(colorName == "15") colorId = 0x312112 //Венге
	if(colorName == "16") colorId = 0x5B3820 //Палисандр
	if(colorName == "60") colorId = 0x454545 //Черный

	//цвета пвх
	if(colorName == "венге") colorId = 0x312112 //Венге
	if(colorName == "красное дерево") colorId = 0x97684A
	if(colorName == "светлый дуб") colorId = 0xB49672
	if(colorName == "орех") colorId = 0x6C3811	
	
	return colorId;
}

/** возвращает цвет поликарбоната
*/

function getPlasticColorId(colorName){
	var colorId = 0x9D9D9D;

	if(colorName == "прозрачный") colorId = 0xffffff
	if(colorName == "черный") colorId = 0x222222
	if(colorName == "бронза") colorId = 0x632e2e
	if(colorName == "коричневый") colorId = 0x73492F
	if(colorName == "опал") colorId = 0xc8c8c8
	if(colorName == "зеленый") colorId = 0x80c956
	if(colorName == "синий") colorId = 0x4f76b5
	if(colorName == "голубой") colorId = 0x79a8ff
	if(colorName == "бирюзовый") colorId = 0x7bc6c7
	if(colorName == "желтый") colorId = 0xffeb3b
	if(colorName == "оранжевый") colorId = 0xff9800
	if(colorName == "красный") colorId = 0xf44336
	if(colorName == "гранат") colorId = 0xe91e63

	return colorId;
}
