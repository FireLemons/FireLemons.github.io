var options = new Vue({
    el: "#options",
    computed: {
        distanceOn: {
            get: function(){
                var distanceOptions = this.options.conversions.distance;
                
                return checkConversionTypeEnabled(distanceOptions) && distanceOptions.on;
            },
            set: function(isEnabled){
                this.options.conversions.distance.on = isEnabled;
                this.SaveOptions();
            }
        },
        distanceDisabled: function(){
            return !checkConversionTypeEnabled(this.options.conversions.distance);
        },
        liquidVolumeOn: {
            get: function(){
                var liquidVolumeOptions = this.options.conversions.liquidVolume;
                
                return checkConversionTypeEnabled(liquidVolumeOptions) && liquidVolumeOptions.on;
            },
            set: function(isEnabled){
                this.options.conversions.liquidVolume.on = isEnabled;
                this.SaveOptions();
            }
        },
        liquidVolumeDisabled: function(){
            return !checkConversionTypeEnabled(this.options.conversions.liquidVolume);
        },
        massOn: {
            get: function(){
                var massOptions = this.options.conversions.mass;
                
                return checkConversionTypeEnabled(massOptions) && massOptions.on;
            },
            set: function(isEnabled){
                this.options.conversions.mass.on = isEnabled;
                this.SaveOptions();
            }
        },
        massDisabled: function(){
            return !checkConversionTypeEnabled(this.options.conversions.mass);
        },
        speedOn: {
            get: function(){
                var speedOptions = this.options.conversions.speed;
                
                return checkConversionTypeEnabled(speedOptions) && speedOptions.on;
            },
            set: function(isEnabled){
                this.options.conversions.speed.on = isEnabled;
                this.SaveOptions();
            }
        },
        speedDisabled: function(){
            return !checkConversionTypeEnabled(this.options.conversions.speed);
        },
        temperatureOn: {
            get: function(){
                var temperatureOptions = this.options.conversions.temperature;
                
                return checkConversionTypeEnabled(temperatureOptions) && temperatureOptions.on;
            },
            set: function(isEnabled){
                this.options.conversions.temperature.on = isEnabled;
                this.SaveOptions();
            }
        },
        temperatureDisabled: function(){
            return !checkConversionTypeEnabled(this.options.conversions.temperature);
        }
    },
    data: {
        options:{
            conversions: {
                distance: {
                    on: true,
                    customary: {
                        inches: true,
                        feet: true,
                        yards: true,
                        miles: true
                    },
                    metric: {
                        millimeters: true,
                        centimeters: true,
                        meters: true,
                        kilometers: true
                    }
                },
                liquidVolume: {
                    on: true,
                    customary: {
                        gallons: true,
                        quarts: true,
                        pints: true,
                        fluidOunces: true
                    },
                    metric: {
                        milliliters: true,
                        liters: true
                    }
                },
                mass: {
                    on: true,
                    customary: {
                        ounces: true,
                        pound: true,
                    },
                    metric: {
                        grams: true,
                        kilograms: true,
                    }
                },
                speed: {
                    on: true,
                    customary: {
                        milesPerHour: true
                    },
                    metric: {
                        kilometersPerHour: true
                    }
                },
                temperature: {
                    on: true,
                    customary: {
                        fahrenheit: true
                    },
                    metric: {
                        celsius: true
                    }
                }
            },
            general:{
                precision: 10
            }
        }
    },
    methods: {
        SaveOptions: function(){

        },
        _SaveOptions: function(){
            localStorage.setItem("ToMetric.Options", JSON.stringify(this.options));
            M.toast({html: "Options Saved"});
        },
        
        loadOptions: function(){
            var options = localStorage.getItem("ToMetric.Options");
            
            if(options){
                this.options = JSON.parse(options);
            }
        }
    },
    mounted: function(){
        this.loadOptions();
        this.$nextTick(function(){
            this.SaveOptions = _.debounce(this._SaveOptions, 500);
        });
    },
    updated: function(){
        this.SaveOptions();
    }
});

/*
 * Checks if all the metric units or all the customary units are off for a type of measurement
 *
 * param: optionsObject
 *      The object containing the toggled states of units
 *
 * return:
 *      true if at least one metric unit and one customary unit are enabled
 *      false otherwise
 */
function checkConversionTypeEnabled(optionsObject){
    
    var isCustomaryEnabled = checkAnyEnabled(optionsObject.customary);
    var isMetricEnabled = checkAnyEnabled(optionsObject.metric);
    
    return isCustomaryEnabled && isMetricEnabled;
}

/*
 * Checks if any units for a measurement system for a type of measurement are on
 *
 * param: optionsObject
 *      The object containing the toggled states of types
 *
 * return:
 *      true if any of the options are enabled
 *      false otherwise
 */
function checkAnyEnabled(optionsObject){
    const booleanReducer = (are_options_on, key) => are_options_on || optionsObject[key];
    
    return Object.keys(optionsObject).reduce(booleanReducer, false);
}

function setBools(ob, state) {
    for(var prop in ob) {
        if(typeof ob[prop] === "boolean") {
            ob[prop] = state;
        } else if(typeof ob[prop] === "object") {
            setBools(ob[prop], state);
        }
    }
}
