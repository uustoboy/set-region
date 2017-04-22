let  region={};
let Max_Size = 10; 

chrome.storage.local.get('region',function(result){

	region = result.region || {};
	
	creaList(region);
	
});


$(function(){

	$('.set-add').click(function(){

		let _originVal = $.trim( $('.input-origin').val() );
		let _origin_agre = $('.input-origin').next().get(0).checked;
		let _replaceVal = $.trim( $('.input-replace').val() );
		let _replace_agre = $('.input-replace').next().get(0).checked;
		let _aliasVal = $.trim( $('.input-alias').val() );

		if( countNum(region) > Max_Size ){
			return boom('最多添加10个！');
		}

		if( region[_aliasVal] != undefined ){
			return boom('已添加！');
		}

		if( _originVal=="" || _replaceVal=="" || _aliasVal=="" ){
			return boom('不能为空！');
		}

		let jsons = {};
		
		region[_aliasVal] = jsons[_aliasVal] = {
			"origin" :_originVal,
			"origin_agre" : _origin_agre,
			"replace": _replaceVal,
			"replace_agre" : _replace_agre,
			"alias":_aliasVal
		}

		chrome.storage.local.set({'region':region}, function() {
			creaList(jsons);
         	boom('添加完成！');
         	$('.input-origin').val('');
         	$('.input-replace').val('');
         	$('.input-alias').val('')
        });

	});
	
	$('.set-switch').click(function(){

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
	
	$('.slide-btn').click(function(){
		if( $('.set-list li').length<= 0 ){
			return boom('列表为空！');
		}
		if( $('.slide-btn').is('.cur') ){
			$('.slide-btn').removeClass('cur');
			$('.set-slide').animate({'left':0},'fast',function(){
				$('.slide-btn').html('[切换已添加页]');
			});
		}else{
			$('.slide-btn').addClass('cur');
			$('.set-slide').animate({'left':-150},'fast',function(){
				$('.slide-btn').html('[切换添加页]');
			});
		}
		
	});
	
	$('.set-list').delegate('.set-close','click',function(){

		let $this = $(this);
		let _aliasVal = $this.prev().text();
		let $parent = $this.parent('li');
		$parent.remove();
		if( $('.set-list li').length <= 0 ){
			boom('列表为空！');
			$('.slide-btn').removeClass('cur');
			$('.set-slide').animate({'left':0},'fast',function(){
				$('.slide-btn').html('[切换已添加页]');
			});
		}
		if( region[_aliasVal] != undefined ){
			delete region[_aliasVal];
		}
		chrome.storage.local.set({'region':region}, function() {
			
        });

	});
	
});

function creaList(json){
	let $ul = $('.set-list ul');
	for (name in json){
		let html=`
			<li>
				<div class="set-info">${name}</div>
				<span class="set-close">X</span>
			</li>
		`;
		$ul.append(html)
	}
	
}


function countNum( json ){
	let count = 0;
	for(let a in json){
        if(json[a]){
            count++;   
        }   
    }
	return count;
}

function boom(txt){
	let html = `
		<div class="set-boom">
			<div class="set-mark"></div>
			<div class="set-alert">
				<span class="set-alertxt">${txt}</span>
			</div>
		</div>
	`;
	let timer = null;
	$('body').append(html);
	$('.set-boom').fadeIn('fast',function(){
		timer = setTimeout(function(){
			$('.set-boom').fadeOut('fast',function(){
				$('.set-boom').remove();
			});
		},450);
	});

}

