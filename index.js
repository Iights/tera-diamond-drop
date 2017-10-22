const Command = require('command');

module.exports = function pingRemover(dispatch){
	const command = Command(dispatch);
	var enabled = false;
	var zone;
	var hiddenPassive = 0xFFFFFFFF;
	var curPos;
	var cid;
	
	command.add('diamond', ()=>{
		enabled = !enabled;
		command.message("Diamond drop hack now " + (enabled?"enabled.":"disabled."));
	});
	
	dispatch.hook('S_LOGIN', 4, e=>{
		cid = e.cid;
	});
	
	dispatch.hook('C_PLAYER_LOCATION', 1, e=>{
		curPos = e;
	});
	
	dispatch.hook('S_LOAD_TOPO', 1, e=>{
		zone = e.zone;
	});
	
	dispatch.hook('S_DESPAWN_NPC', 1, e=>{
		if(e.type != 5 || !enabled || zone != 9713) return;
		if(e.target.high == 819200 && e.x <= 52572 && e.x >= 52568 && e.y <= 117922 && e.y >= 117917){
			hiddenPassive--;
			command.message("*Drops diamond*");
			dispatch.toClient('S_SPAWN_DROPITEM', 2, {
				id: hiddenPassive,
				x: e.x1 || e.x,
				y: e.y1 || e.y,
				z: e.z1 || e.z,
				item: 369,
				amount: 1,
				expiry: 120,
				unk1: 0,
				unk2: 0,
				mob: e.target,
				unk3: 1,
				owners: [{id: cid}]
				
			});
		}
	});
	
	
}
