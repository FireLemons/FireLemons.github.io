var options = new Vue({
    el: "#options",
    data: {
        conversions: {
            distance: {
                enabled: true,
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
            liquid_volume: {
                enabled: true,
                customary: {
                    gallons: true,
                    quarts: true,
                    pints: true,
                    fluid_ounces: true
                },
                metric: {
                    milliliters: true,
                    liters: true
                }
            },
            mass: {
                enabled: true,
                customary: {
                    ounces: true,
                    pound: true,
                    ton_imperial: true
                },
                metric: {
                    grams: true,
                    kilograms: true,
                    ton_metric: true
                }
            },
            speed: {
                enabled: true,
                customary: {
                    miles_per_hour: true
                },
                metric: {
                    kilometers_per_hour: true
                }
            },
            temperature: {
                enabled: true,
                customary: {
                    fahrenheit: true
                },
                metric: {
                    celsius: true
                }
            }
        }
    },
    created: function() {
        this.SaveOptions = _.debounce(this._SaveOptions, 500);
    },
    methods: {
        _SaveOptions: function(){
            localStorage.setItem("ToMetric.Options", JSON.stringify(this.data));
        },
        
        loadOptions: function(){
            var options = localStorage.getItem("ToMetric.Options");
            
            if(options){
                var optionData = JSON.parse(options);
            }
        }
    },
    mounted: function(){
        this.loadOptions();
    },
    updated: function(){
        SaveOptions();
    }
});

function setBools(ob, state) {
    for(var prop in ob) {
        if(typeof ob[prop] === "boolean") {
            ob[prop] = state;
        } else if(typeof ob[prop] === "object") {
            setBools(ob[prop], state);
        }
    }
}
