(function($) {
    $(document).ready(function() {
        function updateCities() {
            var selectCountry = $('select[name="country"]');
            var country = selectCountry.val();
            if (country){
                selectCountry.trigger('change');
            }
        }
        setTimeout(updateCities, 1500);

    })

})(django.jQuery);