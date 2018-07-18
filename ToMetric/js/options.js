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
                    ton_imperial: true
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