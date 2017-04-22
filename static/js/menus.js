//添加右键菜单;
chrome.contextMenus.create({
	"title": "域名助手", 
	"contexts":["all"],
	"onclick":function(info,tab){

		let region = {};

		chrome.storage.local.get('region',function(result){
			
			region = result.region || {};

			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){  
				
				let href = tabs[0].url;
				let url = '';
				let agreement = '';
				for( let val in region ){
			  	
			 		let o = region[val].origin;
			 		let r = region[val].replace;
			 		let origin_agre = region[val].origin_agre;
			 		let replace_agre = region[val].replace_agre;

			 		let origin_reg = new RegExp(o);	
			 		let replace_reg = new RegExp(r);
			 	
				 	if ( origin_reg.test(href) ) {
						
						if( origin_agre && replace_agre || !origin_agre && !replace_agre){
							url = href.replace(o, r);
						}else if( origin_agre && !replace_agre  ){
							agreement = href.replace("http",'https');
							url = agreement.replace(o, r);
						}else if( !origin_agre && replace_agre  ){
							agreement = href.replace("https",'http');
							url = agreement.replace(o, r);
						}
						
						chrome.tabs.update(tabs[0].id, {
							url: url
						}, function(tab){
						});
						
					}else if( replace_reg.test(href) ){
						
						if( origin_agre && replace_agre || !origin_agre && !replace_agre){
							url = href.replace(r, o);
						}else if( origin_agre && !replace_agre ){
							agreement = href.replace("https",'http');
							url = agreement.replace(r,o);
						}else if( !origin_agre && replace_agre ){
							agreement = href.replace("http",'https');
							url = agreement.replace(r,o);
						}		
						
						chrome.tabs.update(tabs[0].id, {
							url: url
						}, function(tab){
						});
					}
				}
			}); 
		});

	}
});