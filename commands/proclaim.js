function getElapsedWeekCount() {
	let today = new Date();
	let utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	
	return Math.floor((utcToday / (1000 * 60 * 60 * 24)) / 7);
};


module.exports = {
	name: 'proclaim',
	description: 'Выслушать предсказание на следующую неделю',
	execute(message, args) {
        function getPosition(week, count, correction) {
            let pos = (week % count) + correction;
    
            if(count <= pos) {
                pos = pos - count;
            }
    
            return pos;
        }
    
    
        let engineers = args.engineers;
        let correctionCoefficient = args.correctionCoefficient;
        if (correctionCoefficient === undefined || correctionCoefficient === 0) {
            correctionCoefficient = 0;
        }
    
        let elapsedWeeks = getElapsedWeekCount();
        
        let position = getPosition(elapsedWeeks, engineers.length, correctionCoefficient);
        let engineer = engineers[position];
    
        let nextPosition = getPosition((elapsedWeeks + 1), engineers.length, correctionCoefficient);
        let nextEngineer = engineers[nextPosition];
    
        let proclamation = `🔮 Астрологи объявили эту неделю неделей ${engineer.gen} <@!${engineer.id}>. ${engineer.nom} удваивает количество закрытых багов 🔮` + 
            `\r\nНа горизонте появляется <@${nextEngineer.id}>.`;
	
        message.channel.send(proclamation);
	},
};