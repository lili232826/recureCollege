export function formatterTime (time) {  
   // let timeParmes=time;
   // let resStr=""
   
   // return resNum
};  

export function formatterLookNum (num) {  
   let numParmes=Number(num);
   let resNum=0;
   
   if(numParmes>10000){
	   resNum=(numParmes/10000).toFixed(1)+"W+";
   }else{
	   resNum=numParmes;
   }
   return resNum
}; 
export function formatterReplyNum (num) {  
   let numParmes=Number(num);
   let resNum=""
   if(numParmes>1000){
	   resNum=(numParmes/1000).toFixed(0)+"K"
   }else{
	   resNum=numParmes
   }
   return resNum
}; 
export function formatterFiltertags(str,len){
	str = str?str.replace(/<\/?[^>]*>/g, '').replace(/&nbsp;/ig,''):'';
	  if (!str || str == '') {
	    return ''
	  }
	  if(len&&str.length > len){
	    str = str.substr(0,len) + '...'
	  }
	  return str
}