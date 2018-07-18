var options = new Vue({
    el: "#options",
    data: {
        conversions: {
            distance: {
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
                customary: {
                    ounces: true,
                    pound: true,
                    ton_imperial: true
                },
                metric: {
                    grams: true,
                    kilograms: true,
                    ton_imperial: true
                }
            },
            speed: {
                customary: {
                    miles_per_hour: true
                },
                metric: {
                    kilometers_per_hour: true
                }
            },
            temperature: {
                customary: {
                    fahrenheit: true
                },
                metric: {
                    celsius: true
                }
            }
        }
    },
    methods: {
        loadOptions: function(){
            var options = localStorage.getItem("ToMetric.Options");
            
            if(options){
                var optionData = JSON.parse(options);
            }
        }
    },
    mounted: function(){
        this.loadOptions();
    }
});