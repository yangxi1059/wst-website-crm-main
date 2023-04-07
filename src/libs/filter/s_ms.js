export default (time) => {
	time = parseInt(time)
	let s = time % 60;
	let m = (time - s) / 60;
	if(s < 10){
		s = '0' + s;
	}
	if(m < 10){
		m = '0' + m;
	}
	return m + ':' + s;
}