const userNames = ['' , 'Phương' , 'Pha' , 'Thịnh' , 'Tuấn'];

export const idsToNames = (input : string): string => {
    return input.split(',').map(id => userNames[parseInt(id)]).join(',');
}