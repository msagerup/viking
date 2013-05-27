// strftime relies on https://github.com/samsonjs/strftime. It supports
// standard specifiers from C as well as some other extensions from Ruby.
Date.prototype.strftime = function(fmt) {
    return strftime(fmt, this);
};

// Since IE8 does not support new Dates with the ISO 8601 format we'll add
// supoprt for it
(function(){
    var d = new Date('2011-06-02T09:34:29+02:00');
    if(!d || +d !== 1307000069000) {
        Date.fromISO = function(s) {
            var i, day, tz, regex, match;
            
            regex = /^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/;
            match = regex.exec(s) || [];
            
            if(match[1]){
                day = match[1].split(/\D/);
                for( i= 0; i < day.length; i++) {
                    day[i] = parseInt(day[i], 10) || 0;
                }
                day[1] -= 1;
                day = new Date(Date.UTC.apply(Date, day));
                if(!day.getDate()) { return NaN; }
                if(match[5]){
                    tz = (parseInt(match[5], 10)*60);
                    if(match[6]) { tz += parseInt(match[6], 10); }
                    if(match[4] === '+') { tz*= -1; }
                    if(tz) { day.setUTCMinutes(day.getUTCMinutes()+ tz); }
                }
                return day;
            }

            return NaN;
        };
    } else {
        Date.fromISO = function(s){
            return new Date(s);
        };
    }
}());