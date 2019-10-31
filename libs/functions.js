let periods = {
  month: 30 * 24 * 60 * 60,
  week: 7 * 24 * 60 * 60,
  day: 24 * 60 * 60,
  hour: 60 * 60,
  minute: 60
};

formatTime = (timestamp) => {
    let time_diff = Math.round(Date.now()/1000) - timestamp;
    let seconds = time_diff;
    let minutes = Math.round(time_diff/60);
    let hours = Math.round(time_diff/3600);
    let days = Math.round(time_diff/86400);
    let weeks = Math.round(time_diff/604800);
    let months = Math.round(time_diff/2592000);
    let years = Math.round(time_diff/31536000);

    if(seconds <= 60) {
        if(seconds < 2) {
            return "Just now";
        }  else {
            return seconds + " seconds ago";
        }
    }
    else if(minutes <= 60) {
        if(minutes == 1) {
            return "1 minute ago";
        } else {
            return minutes+ " minutes ago";
        }
    }
    else if(hours <= 24) {
        if(hours == 1) {
            return "1 hour ago";
        } else {
            return hours+ " hours ago";
        }
    }
    else if(days <= 7) {
        if(days == 1) {
            return "1 day ago";
        } else {
            return days+ " days ago";
        }
    }
    else if(weeks <= 4) {
        if(weeks == 1) {
            return "1 week ago";
        } else {
            return weeks+ " weeks ago";
        }
    }
    else if(months <= 12) {
        if(months == 1) {
            return "1 month ago";
        } else {
            return months+ " months ago";
        }
    }
    else {
        if(years == 1) {
            return "1 year ago";
        } else {
            return years+ " years ago";
        }
    }
}

generateRandNum = (length) => {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let char_length = characters.length;

	for(let i = 0; i < length; i++) {
		result+= characters.charAt(Math.floor(Math.random() * char_length));
	}
	return result;
}

currentDate = (timestamp, return_type) => {
    let d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
        ampm = 'AM',
        ss = d.getSeconds(),
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    // ie: 2014-03-24, 3:00 PM
   
    if (return_type == "date_only") {
        result  = yyyy + '-' + mm + '-' + dd;
    } else if (return_type == "date_time") {
        result  = yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + min + ':' + ss +' ' + ampm;
    } 

    return result;
}

currentTimestamp = _ => {
	let timestamp = Math.round(Date.now()/1000);
	return timestamp;
}

toTimestamp = date => {
    let converted_date = Date.parse(date);
    return converted_date;
}

capitalizeWord = (str) => {
    return str.toLowerCase().split(' ').map( word=>word.charAt(0).toUpperCase()+word.slice(1)).join(' ');
}

capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase()+ str.slice(1);
}

trimString = x  => {
    return x.replace(/^\s+|\s+$/gm,'');
}

module.exports = {
	genRand: generateRandNum,
    formatTime: formatTime,
	curDate: currentDate,
	curTimestamp: currentTimestamp,
    toTimestamp: toTimestamp,
    capitalizeWord: capitalizeWord,
    trimString: trimString,
    capitalizeFirstLetter: capitalizeFirstLetter
}
