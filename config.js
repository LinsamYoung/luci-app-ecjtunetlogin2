var pageSetting=2;//1:vlan  2:ip  3:ssid  4:区域ID

/********************  SSID外置登陆对应配置  ********************/
var ssidPageAry = new Array(301);// 空表示未使用
//名称|ssid|虚拟商号|重定向地址|审核标记，0未审，1审过，2审不过|认证方式(0-本地认证；1-PORTAL协议；2-Ruckus；3-Cisco；4-Moto；5-JUNIPER；6-Aruba6.4.2.2；7-Aruba旧版本)
ssidPageAry[0]="default|000|000||1|0";
ssidPageAry[1]="";
ssidPageAry[2]="";
ssidPageAry[3]="";
ssidPageAry[4]="";
ssidPageAry[5]="";
ssidPageAry[6]="";
ssidPageAry[7]="";
ssidPageAry[8]="";
ssidPageAry[9]="";
ssidPageAry[10]="";
ssidPageAry[11]="";
ssidPageAry[12]="";
ssidPageAry[13]="";
ssidPageAry[14]="";
ssidPageAry[15]="";
ssidPageAry[16]="";
ssidPageAry[17]="";
ssidPageAry[18]="";
ssidPageAry[19]="";
ssidPageAry[20]="";
ssidPageAry[21]="";
ssidPageAry[22]="";
ssidPageAry[23]="";
ssidPageAry[24]="";
ssidPageAry[25]="";
ssidPageAry[26]="";
ssidPageAry[27]="";
ssidPageAry[28]="";
ssidPageAry[29]="";
ssidPageAry[30]="";
ssidPageAry[31]="";
ssidPageAry[32]="";
ssidPageAry[33]="";
ssidPageAry[34]="";
ssidPageAry[35]="";
ssidPageAry[36]="";
ssidPageAry[37]="";
ssidPageAry[38]="";
ssidPageAry[39]="";
ssidPageAry[40]="";
ssidPageAry[41]="";
ssidPageAry[42]="";
ssidPageAry[43]="";
ssidPageAry[44]="";
ssidPageAry[45]="";
ssidPageAry[46]="";
ssidPageAry[47]="";
ssidPageAry[48]="";
ssidPageAry[49]="";
ssidPageAry[50]="";
ssidPageAry[51]="";
ssidPageAry[52]="";
ssidPageAry[53]="";
ssidPageAry[54]="";
ssidPageAry[55]="";
ssidPageAry[56]="";
ssidPageAry[57]="";
ssidPageAry[58]="";
ssidPageAry[59]="";
ssidPageAry[60]="";
ssidPageAry[61]="";
ssidPageAry[62]="";
ssidPageAry[63]="";
ssidPageAry[64]="";
ssidPageAry[65]="";
ssidPageAry[66]="";
ssidPageAry[67]="";
ssidPageAry[68]="";
ssidPageAry[69]="";
ssidPageAry[70]="";
ssidPageAry[71]="";
ssidPageAry[72]="";
ssidPageAry[73]="";
ssidPageAry[74]="";
ssidPageAry[75]="";
ssidPageAry[76]="";
ssidPageAry[77]="";
ssidPageAry[78]="";
ssidPageAry[79]="";
ssidPageAry[80]="";
ssidPageAry[81]="";
ssidPageAry[82]="";
ssidPageAry[83]="";
ssidPageAry[84]="";
ssidPageAry[85]="";
ssidPageAry[86]="";
ssidPageAry[87]="";
ssidPageAry[88]="";
ssidPageAry[89]="";
ssidPageAry[90]="";
ssidPageAry[91]="";
ssidPageAry[92]="";
ssidPageAry[93]="";
ssidPageAry[94]="";
ssidPageAry[95]="";
ssidPageAry[96]="";
ssidPageAry[97]="";
ssidPageAry[98]="";
ssidPageAry[99]="";
ssidPageAry[100]="";
ssidPageAry[101]="";
ssidPageAry[102]="";
ssidPageAry[103]="";
ssidPageAry[104]="";
ssidPageAry[105]="";
ssidPageAry[106]="";
ssidPageAry[107]="";
ssidPageAry[108]="";
ssidPageAry[109]="";
ssidPageAry[110]="";
ssidPageAry[111]="";
ssidPageAry[112]="";
ssidPageAry[113]="";
ssidPageAry[114]="";
ssidPageAry[115]="";
ssidPageAry[116]="";
ssidPageAry[117]="";
ssidPageAry[118]="";
ssidPageAry[119]="";
ssidPageAry[120]="";
ssidPageAry[121]="";
ssidPageAry[122]="";
ssidPageAry[123]="";
ssidPageAry[124]="";
ssidPageAry[125]="";
ssidPageAry[126]="";
ssidPageAry[127]="";
ssidPageAry[128]="";
ssidPageAry[129]="";
ssidPageAry[130]="";
ssidPageAry[131]="";
ssidPageAry[132]="";
ssidPageAry[133]="";
ssidPageAry[134]="";
ssidPageAry[135]="";
ssidPageAry[136]="";
ssidPageAry[137]="";
ssidPageAry[138]="";
ssidPageAry[139]="";
ssidPageAry[140]="";
ssidPageAry[141]="";
ssidPageAry[142]="";
ssidPageAry[143]="";
ssidPageAry[144]="";
ssidPageAry[145]="";
ssidPageAry[146]="";
ssidPageAry[147]="";
ssidPageAry[148]="";
ssidPageAry[149]="";
ssidPageAry[150]="";
ssidPageAry[151]="";
ssidPageAry[152]="";
ssidPageAry[153]="";
ssidPageAry[154]="";
ssidPageAry[155]="";
ssidPageAry[156]="";
ssidPageAry[157]="";
ssidPageAry[158]="";
ssidPageAry[159]="";
ssidPageAry[160]="";
ssidPageAry[161]="";
ssidPageAry[162]="";
ssidPageAry[163]="";
ssidPageAry[164]="";
ssidPageAry[165]="";
ssidPageAry[166]="";
ssidPageAry[167]="";
ssidPageAry[168]="";
ssidPageAry[169]="";
ssidPageAry[170]="";
ssidPageAry[171]="";
ssidPageAry[172]="";
ssidPageAry[173]="";
ssidPageAry[174]="";
ssidPageAry[175]="";
ssidPageAry[176]="";
ssidPageAry[177]="";
ssidPageAry[178]="";
ssidPageAry[179]="";
ssidPageAry[180]="";
ssidPageAry[181]="";
ssidPageAry[182]="";
ssidPageAry[183]="";
ssidPageAry[184]="";
ssidPageAry[185]="";
ssidPageAry[186]="";
ssidPageAry[187]="";
ssidPageAry[188]="";
ssidPageAry[189]="";
ssidPageAry[190]="";
ssidPageAry[191]="";
ssidPageAry[192]="";
ssidPageAry[193]="";
ssidPageAry[194]="";
ssidPageAry[195]="";
ssidPageAry[196]="";
ssidPageAry[197]="";
ssidPageAry[198]="";
ssidPageAry[199]="";
ssidPageAry[200]="";
ssidPageAry[201]="";
ssidPageAry[202]="";
ssidPageAry[203]="";
ssidPageAry[204]="";
ssidPageAry[205]="";
ssidPageAry[206]="";
ssidPageAry[207]="";
ssidPageAry[208]="";
ssidPageAry[209]="";
ssidPageAry[210]="";
ssidPageAry[211]="";
ssidPageAry[212]="";
ssidPageAry[213]="";
ssidPageAry[214]="";
ssidPageAry[215]="";
ssidPageAry[216]="";
ssidPageAry[217]="";
ssidPageAry[218]="";
ssidPageAry[219]="";
ssidPageAry[220]="";
ssidPageAry[221]="";
ssidPageAry[222]="";
ssidPageAry[223]="";
ssidPageAry[224]="";
ssidPageAry[225]="";
ssidPageAry[226]="";
ssidPageAry[227]="";
ssidPageAry[228]="";
ssidPageAry[229]="";
ssidPageAry[230]="";
ssidPageAry[231]="";
ssidPageAry[232]="";
ssidPageAry[233]="";
ssidPageAry[234]="";
ssidPageAry[235]="";
ssidPageAry[236]="";
ssidPageAry[237]="";
ssidPageAry[238]="";
ssidPageAry[239]="";
ssidPageAry[240]="";
ssidPageAry[241]="";
ssidPageAry[242]="";
ssidPageAry[243]="";
ssidPageAry[244]="";
ssidPageAry[245]="";
ssidPageAry[246]="";
ssidPageAry[247]="";
ssidPageAry[248]="";
ssidPageAry[249]="";
ssidPageAry[250]="";
ssidPageAry[251]="";
ssidPageAry[252]="";
ssidPageAry[253]="";
ssidPageAry[254]="";
ssidPageAry[255]="";
ssidPageAry[256]="";
ssidPageAry[257]="";
ssidPageAry[258]="";
ssidPageAry[259]="";
ssidPageAry[260]="";
ssidPageAry[261]="";
ssidPageAry[262]="";
ssidPageAry[263]="";
ssidPageAry[264]="";
ssidPageAry[265]="";
ssidPageAry[266]="";
ssidPageAry[267]="";
ssidPageAry[268]="";
ssidPageAry[269]="";
ssidPageAry[270]="";
ssidPageAry[271]="";
ssidPageAry[272]="";
ssidPageAry[273]="";
ssidPageAry[274]="";
ssidPageAry[275]="";
ssidPageAry[276]="";
ssidPageAry[277]="";
ssidPageAry[278]="";
ssidPageAry[279]="";
ssidPageAry[280]="";
ssidPageAry[281]="";
ssidPageAry[282]="";
ssidPageAry[283]="";
ssidPageAry[284]="";
ssidPageAry[285]="";
ssidPageAry[286]="";
ssidPageAry[287]="";
ssidPageAry[288]="";
ssidPageAry[289]="";
ssidPageAry[290]="";
ssidPageAry[291]="";
ssidPageAry[292]="";
ssidPageAry[293]="";
ssidPageAry[294]="";
ssidPageAry[295]="";
ssidPageAry[296]="";
ssidPageAry[297]="";
ssidPageAry[298]="";
ssidPageAry[299]="";
ssidPageAry[300]="";

var vlanPageAry = new Array(301);// 空表示未使用

//名称|vlan-start|vlan-end|虚拟商号器|重定向地址|审核标记，0未审，1审过，2审不过|认证方式(0-本地认证；1-PORTAL协议；2-Ruckus；3-Cisco；4-Moto；5-JUNIPER；6-Aruba6.4.2.2；7-Aruba旧版本)
vlanPageAry[0]="default|0|4096|000||1|0";
vlanPageAry[1]="";
vlanPageAry[2]="";
vlanPageAry[3]="";
vlanPageAry[4]="";
vlanPageAry[5]="";
vlanPageAry[6]="";
vlanPageAry[7]="";
vlanPageAry[8]="";
vlanPageAry[9]="";
vlanPageAry[10]="";
vlanPageAry[11]="";
vlanPageAry[12]="";
vlanPageAry[13]="";
vlanPageAry[14]="";
vlanPageAry[15]="";
vlanPageAry[16]="";
vlanPageAry[17]="";
vlanPageAry[18]="";
vlanPageAry[19]="";
vlanPageAry[20]="";
vlanPageAry[21]="";
vlanPageAry[22]="";
vlanPageAry[23]="";
vlanPageAry[24]="";
vlanPageAry[25]="";
vlanPageAry[26]="";
vlanPageAry[27]="";
vlanPageAry[28]="";
vlanPageAry[29]="";
vlanPageAry[30]="";
vlanPageAry[31]="";
vlanPageAry[32]="";
vlanPageAry[33]="";
vlanPageAry[34]="";
vlanPageAry[35]="";
vlanPageAry[36]="";
vlanPageAry[37]="";
vlanPageAry[38]="";
vlanPageAry[39]="";
vlanPageAry[40]="";
vlanPageAry[41]="";
vlanPageAry[42]="";
vlanPageAry[43]="";
vlanPageAry[44]="";
vlanPageAry[45]="";
vlanPageAry[46]="";
vlanPageAry[47]="";
vlanPageAry[48]="";
vlanPageAry[49]="";
vlanPageAry[50]="";
vlanPageAry[51]="";
vlanPageAry[52]="";
vlanPageAry[53]="";
vlanPageAry[54]="";
vlanPageAry[55]="";
vlanPageAry[56]="";
vlanPageAry[57]="";
vlanPageAry[58]="";
vlanPageAry[59]="";
vlanPageAry[60]="";
vlanPageAry[61]="";
vlanPageAry[62]="";
vlanPageAry[63]="";
vlanPageAry[64]="";
vlanPageAry[65]="";
vlanPageAry[66]="";
vlanPageAry[67]="";
vlanPageAry[68]="";
vlanPageAry[69]="";
vlanPageAry[70]="";
vlanPageAry[71]="";
vlanPageAry[72]="";
vlanPageAry[73]="";
vlanPageAry[74]="";
vlanPageAry[75]="";
vlanPageAry[76]="";
vlanPageAry[77]="";
vlanPageAry[78]="";
vlanPageAry[79]="";
vlanPageAry[80]="";
vlanPageAry[81]="";
vlanPageAry[82]="";
vlanPageAry[83]="";
vlanPageAry[84]="";
vlanPageAry[85]="";
vlanPageAry[86]="";
vlanPageAry[87]="";
vlanPageAry[88]="";
vlanPageAry[89]="";
vlanPageAry[90]="";
vlanPageAry[91]="";
vlanPageAry[92]="";
vlanPageAry[93]="";
vlanPageAry[94]="";
vlanPageAry[95]="";
vlanPageAry[96]="";
vlanPageAry[97]="";
vlanPageAry[98]="";
vlanPageAry[99]="";
vlanPageAry[100]="";
vlanPageAry[101]="";
vlanPageAry[102]="";
vlanPageAry[103]="";
vlanPageAry[104]="";
vlanPageAry[105]="";
vlanPageAry[106]="";
vlanPageAry[107]="";
vlanPageAry[108]="";
vlanPageAry[109]="";
vlanPageAry[110]="";
vlanPageAry[111]="";
vlanPageAry[112]="";
vlanPageAry[113]="";
vlanPageAry[114]="";
vlanPageAry[115]="";
vlanPageAry[116]="";
vlanPageAry[117]="";
vlanPageAry[118]="";
vlanPageAry[119]="";
vlanPageAry[120]="";
vlanPageAry[121]="";
vlanPageAry[122]="";
vlanPageAry[123]="";
vlanPageAry[124]="";
vlanPageAry[125]="";
vlanPageAry[126]="";
vlanPageAry[127]="";
vlanPageAry[128]="";
vlanPageAry[129]="";
vlanPageAry[130]="";
vlanPageAry[131]="";
vlanPageAry[132]="";
vlanPageAry[133]="";
vlanPageAry[134]="";
vlanPageAry[135]="";
vlanPageAry[136]="";
vlanPageAry[137]="";
vlanPageAry[138]="";
vlanPageAry[139]="";
vlanPageAry[140]="";
vlanPageAry[141]="";
vlanPageAry[142]="";
vlanPageAry[143]="";
vlanPageAry[144]="";
vlanPageAry[145]="";
vlanPageAry[146]="";
vlanPageAry[147]="";
vlanPageAry[148]="";
vlanPageAry[149]="";
vlanPageAry[150]="";
vlanPageAry[151]="";
vlanPageAry[152]="";
vlanPageAry[153]="";
vlanPageAry[154]="";
vlanPageAry[155]="";
vlanPageAry[156]="";
vlanPageAry[157]="";
vlanPageAry[158]="";
vlanPageAry[159]="";
vlanPageAry[160]="";
vlanPageAry[161]="";
vlanPageAry[162]="";
vlanPageAry[163]="";
vlanPageAry[164]="";
vlanPageAry[165]="";
vlanPageAry[166]="";
vlanPageAry[167]="";
vlanPageAry[168]="";
vlanPageAry[169]="";
vlanPageAry[170]="";
vlanPageAry[171]="";
vlanPageAry[172]="";
vlanPageAry[173]="";
vlanPageAry[174]="";
vlanPageAry[175]="";
vlanPageAry[176]="";
vlanPageAry[177]="";
vlanPageAry[178]="";
vlanPageAry[179]="";
vlanPageAry[180]="";
vlanPageAry[181]="";
vlanPageAry[182]="";
vlanPageAry[183]="";
vlanPageAry[184]="";
vlanPageAry[185]="";
vlanPageAry[186]="";
vlanPageAry[187]="";
vlanPageAry[188]="";
vlanPageAry[189]="";
vlanPageAry[190]="";
vlanPageAry[191]="";
vlanPageAry[192]="";
vlanPageAry[193]="";
vlanPageAry[194]="";
vlanPageAry[195]="";
vlanPageAry[196]="";
vlanPageAry[197]="";
vlanPageAry[198]="";
vlanPageAry[199]="";
vlanPageAry[200]="";
vlanPageAry[201]="";
vlanPageAry[202]="";
vlanPageAry[203]="";
vlanPageAry[204]="";
vlanPageAry[205]="";
vlanPageAry[206]="";
vlanPageAry[207]="";
vlanPageAry[208]="";
vlanPageAry[209]="";
vlanPageAry[210]="";
vlanPageAry[211]="";
vlanPageAry[212]="";
vlanPageAry[213]="";
vlanPageAry[214]="";
vlanPageAry[215]="";
vlanPageAry[216]="";
vlanPageAry[217]="";
vlanPageAry[218]="";
vlanPageAry[219]="";
vlanPageAry[220]="";
vlanPageAry[221]="";
vlanPageAry[222]="";
vlanPageAry[223]="";
vlanPageAry[224]="";
vlanPageAry[225]="";
vlanPageAry[226]="";
vlanPageAry[227]="";
vlanPageAry[228]="";
vlanPageAry[229]="";
vlanPageAry[230]="";
vlanPageAry[231]="";
vlanPageAry[232]="";
vlanPageAry[233]="";
vlanPageAry[234]="";
vlanPageAry[235]="";
vlanPageAry[236]="";
vlanPageAry[237]="";
vlanPageAry[238]="";
vlanPageAry[239]="";
vlanPageAry[240]="";
vlanPageAry[241]="";
vlanPageAry[242]="";
vlanPageAry[243]="";
vlanPageAry[244]="";
vlanPageAry[245]="";
vlanPageAry[246]="";
vlanPageAry[247]="";
vlanPageAry[248]="";
vlanPageAry[249]="";
vlanPageAry[250]="";
vlanPageAry[251]="";
vlanPageAry[252]="";
vlanPageAry[253]="";
vlanPageAry[254]="";
vlanPageAry[255]="";
vlanPageAry[256]="";
vlanPageAry[257]="";
vlanPageAry[258]="";
vlanPageAry[259]="";
vlanPageAry[260]="";
vlanPageAry[261]="";
vlanPageAry[262]="";
vlanPageAry[263]="";
vlanPageAry[264]="";
vlanPageAry[265]="";
vlanPageAry[266]="";
vlanPageAry[267]="";
vlanPageAry[268]="";
vlanPageAry[269]="";
vlanPageAry[270]="";
vlanPageAry[271]="";
vlanPageAry[272]="";
vlanPageAry[273]="";
vlanPageAry[274]="";
vlanPageAry[275]="";
vlanPageAry[276]="";
vlanPageAry[277]="";
vlanPageAry[278]="";
vlanPageAry[279]="";
vlanPageAry[280]="";
vlanPageAry[281]="";
vlanPageAry[282]="";
vlanPageAry[283]="";
vlanPageAry[284]="";
vlanPageAry[285]="";
vlanPageAry[286]="";
vlanPageAry[287]="";
vlanPageAry[288]="";
vlanPageAry[289]="";
vlanPageAry[290]="";
vlanPageAry[291]="";
vlanPageAry[292]="";
vlanPageAry[293]="";
vlanPageAry[294]="";
vlanPageAry[295]="";
vlanPageAry[296]="";
vlanPageAry[297]="";
vlanPageAry[298]="";
vlanPageAry[299]="";
vlanPageAry[300]="";


var ipPageAry = new Array(301);// 空表示未使用
//名称|ip-start|ip-end|虚拟商号|重定向地址|审核标记，0未审，1审过，2审不过|认证方式(0-本地认证；1-PORTAL协议；2-Ruckus；3-Cisco；4-Moto；5-JUNIPER；6-Aruba6.4.2.2；7-Aruba旧版本)
ipPageAry[0]="默认模版|0.0.0.0|255.255.255.255|||1|1";
ipPageAry[1]="school|1.1.1.1|10.9.255.254|||1|1";
ipPageAry[2]="tushuguan|10.10.0.1|10.10.255.254|||1|1";
ipPageAry[3]="student|10.16.0.1|10.31.255.254|||1|1";
ipPageAry[4]="school-1|10.54.0.1|255.255.255.255|||1|1";
ipPageAry[5]="wifi-page|10.48.0.1|10.48.255.254|||1|1";
ipPageAry[6]="teacher-wifi|10.49.0.0|10.49.255.255||http://172.16.2.100/1.htm|1|1";
ipPageAry[7]="student-副本1|10.32.0.0|10.47.255.254|||1|1";
ipPageAry[8]="student-副本2|10.52.0.0|10.53.255.255|||1|1";
ipPageAry[9]="";
ipPageAry[10]="";
ipPageAry[11]="";
ipPageAry[12]="";
ipPageAry[13]="";
ipPageAry[14]="";
ipPageAry[15]="";
ipPageAry[16]="";
ipPageAry[17]="";
ipPageAry[18]="";
ipPageAry[19]="";
ipPageAry[20]="";
ipPageAry[21]="";
ipPageAry[22]="";
ipPageAry[23]="";
ipPageAry[24]="";
ipPageAry[25]="";
ipPageAry[26]="";
ipPageAry[27]="";
ipPageAry[28]="";
ipPageAry[29]="";
ipPageAry[30]="";
ipPageAry[31]="";
ipPageAry[32]="";
ipPageAry[33]="";
ipPageAry[34]="";
ipPageAry[35]="";
ipPageAry[36]="";
ipPageAry[37]="";
ipPageAry[38]="";
ipPageAry[39]="";
ipPageAry[40]="";
ipPageAry[41]="";
ipPageAry[42]="";
ipPageAry[43]="";
ipPageAry[44]="";
ipPageAry[45]="";
ipPageAry[46]="";
ipPageAry[47]="";
ipPageAry[48]="";
ipPageAry[49]="";
ipPageAry[50]="";
ipPageAry[51]="";
ipPageAry[52]="";
ipPageAry[53]="";
ipPageAry[54]="";
ipPageAry[55]="";
ipPageAry[56]="";
ipPageAry[57]="";
ipPageAry[58]="";
ipPageAry[59]="";
ipPageAry[60]="";
ipPageAry[61]="";
ipPageAry[62]="";
ipPageAry[63]="";
ipPageAry[64]="";
ipPageAry[65]="";
ipPageAry[66]="";
ipPageAry[67]="";
ipPageAry[68]="";
ipPageAry[69]="";
ipPageAry[70]="";
ipPageAry[71]="";
ipPageAry[72]="";
ipPageAry[73]="";
ipPageAry[74]="";
ipPageAry[75]="";
ipPageAry[76]="";
ipPageAry[77]="";
ipPageAry[78]="";
ipPageAry[79]="";
ipPageAry[80]="";
ipPageAry[81]="";
ipPageAry[82]="";
ipPageAry[83]="";
ipPageAry[84]="";
ipPageAry[85]="";
ipPageAry[86]="";
ipPageAry[87]="";
ipPageAry[88]="";
ipPageAry[89]="";
ipPageAry[90]="";
ipPageAry[91]="";
ipPageAry[92]="";
ipPageAry[93]="";
ipPageAry[94]="";
ipPageAry[95]="";
ipPageAry[96]="";
ipPageAry[97]="";
ipPageAry[98]="";
ipPageAry[99]="";
ipPageAry[100]="";
ipPageAry[101]="";
ipPageAry[102]="";
ipPageAry[103]="";
ipPageAry[104]="";
ipPageAry[105]="";
ipPageAry[106]="";
ipPageAry[107]="";
ipPageAry[108]="";
ipPageAry[109]="";
ipPageAry[110]="";
ipPageAry[111]="";
ipPageAry[112]="";
ipPageAry[113]="";
ipPageAry[114]="";
ipPageAry[115]="";
ipPageAry[116]="";
ipPageAry[117]="";
ipPageAry[118]="";
ipPageAry[119]="";
ipPageAry[120]="";
ipPageAry[121]="";
ipPageAry[122]="";
ipPageAry[123]="";
ipPageAry[124]="";
ipPageAry[125]="";
ipPageAry[126]="";
ipPageAry[127]="";
ipPageAry[128]="";
ipPageAry[129]="";
ipPageAry[130]="";
ipPageAry[131]="";
ipPageAry[132]="";
ipPageAry[133]="";
ipPageAry[134]="";
ipPageAry[135]="";
ipPageAry[136]="";
ipPageAry[137]="";
ipPageAry[138]="";
ipPageAry[139]="";
ipPageAry[140]="";
ipPageAry[141]="";
ipPageAry[142]="";
ipPageAry[143]="";
ipPageAry[144]="";
ipPageAry[145]="";
ipPageAry[146]="";
ipPageAry[147]="";
ipPageAry[148]="";
ipPageAry[149]="";
ipPageAry[150]="";
ipPageAry[151]="";
ipPageAry[152]="";
ipPageAry[153]="";
ipPageAry[154]="";
ipPageAry[155]="";
ipPageAry[156]="";
ipPageAry[157]="";
ipPageAry[158]="";
ipPageAry[159]="";
ipPageAry[160]="";
ipPageAry[161]="";
ipPageAry[162]="";
ipPageAry[163]="";
ipPageAry[164]="";
ipPageAry[165]="";
ipPageAry[166]="";
ipPageAry[167]="";
ipPageAry[168]="";
ipPageAry[169]="";
ipPageAry[170]="";
ipPageAry[171]="";
ipPageAry[172]="";
ipPageAry[173]="";
ipPageAry[174]="";
ipPageAry[175]="";
ipPageAry[176]="";
ipPageAry[177]="";
ipPageAry[178]="";
ipPageAry[179]="";
ipPageAry[180]="";
ipPageAry[181]="";
ipPageAry[182]="";
ipPageAry[183]="";
ipPageAry[184]="";
ipPageAry[185]="";
ipPageAry[186]="";
ipPageAry[187]="";
ipPageAry[188]="";
ipPageAry[189]="";
ipPageAry[190]="";
ipPageAry[191]="";
ipPageAry[192]="";
ipPageAry[193]="";
ipPageAry[194]="";
ipPageAry[195]="";
ipPageAry[196]="";
ipPageAry[197]="";
ipPageAry[198]="";
ipPageAry[199]="";
ipPageAry[200]="";
ipPageAry[201]="";
ipPageAry[202]="";
ipPageAry[203]="";
ipPageAry[204]="";
ipPageAry[205]="";
ipPageAry[206]="";
ipPageAry[207]="";
ipPageAry[208]="";
ipPageAry[209]="";
ipPageAry[210]="";
ipPageAry[211]="";
ipPageAry[212]="";
ipPageAry[213]="";
ipPageAry[214]="";
ipPageAry[215]="";
ipPageAry[216]="";
ipPageAry[217]="";
ipPageAry[218]="";
ipPageAry[219]="";
ipPageAry[220]="";
ipPageAry[221]="";
ipPageAry[222]="";
ipPageAry[223]="";
ipPageAry[224]="";
ipPageAry[225]="";
ipPageAry[226]="";
ipPageAry[227]="";
ipPageAry[228]="";
ipPageAry[229]="";
ipPageAry[230]="";
ipPageAry[231]="";
ipPageAry[232]="";
ipPageAry[233]="";
ipPageAry[234]="";
ipPageAry[235]="";
ipPageAry[236]="";
ipPageAry[237]="";
ipPageAry[238]="";
ipPageAry[239]="";
ipPageAry[240]="";
ipPageAry[241]="";
ipPageAry[242]="";
ipPageAry[243]="";
ipPageAry[244]="";
ipPageAry[245]="";
ipPageAry[246]="";
ipPageAry[247]="";
ipPageAry[248]="";
ipPageAry[249]="";
ipPageAry[250]="";
ipPageAry[251]="";
ipPageAry[252]="";
ipPageAry[253]="";
ipPageAry[254]="";
ipPageAry[255]="";
ipPageAry[256]="";
ipPageAry[257]="";
ipPageAry[258]="";
ipPageAry[259]="";
ipPageAry[260]="";
ipPageAry[261]="";
ipPageAry[262]="";
ipPageAry[263]="";
ipPageAry[264]="";
ipPageAry[265]="";
ipPageAry[266]="";
ipPageAry[267]="";
ipPageAry[268]="";
ipPageAry[269]="";
ipPageAry[270]="";
ipPageAry[271]="";
ipPageAry[272]="";
ipPageAry[273]="";
ipPageAry[274]="";
ipPageAry[275]="";
ipPageAry[276]="";
ipPageAry[277]="";
ipPageAry[278]="";
ipPageAry[279]="";
ipPageAry[280]="";
ipPageAry[281]="";
ipPageAry[282]="";
ipPageAry[283]="";
ipPageAry[284]="";
ipPageAry[285]="";
ipPageAry[286]="";
ipPageAry[287]="";
ipPageAry[288]="";
ipPageAry[289]="";
ipPageAry[290]="";
ipPageAry[291]="";
ipPageAry[292]="";
ipPageAry[293]="";
ipPageAry[294]="";
ipPageAry[295]="";
ipPageAry[296]="";
ipPageAry[297]="";
ipPageAry[298]="";
ipPageAry[299]="";
ipPageAry[300]="";

/********************  areaID外置登陆对应配置  ********************/
var areaIDPageAry = new Array(301);// 空表示未使用
//名称|区域id|虚拟商号|重定向地址|审核标记，0未审，1审过，2审不过|认证方式(0-本地认证；1-PORTAL协议；2-Ruckus；3-Cisco；4-Moto；5-JUNIPER；6-Aruba6.4.2.2；7-Aruba旧版本)
areaIDPageAry[0]="default|000|000||1|0";
areaIDPageAry[1]="";
areaIDPageAry[2]="";
areaIDPageAry[3]="";
areaIDPageAry[4]="";
areaIDPageAry[5]="";
areaIDPageAry[6]="";
areaIDPageAry[7]="";
areaIDPageAry[8]="";
areaIDPageAry[9]="";
areaIDPageAry[10]="";
areaIDPageAry[11]="";
areaIDPageAry[12]="";
areaIDPageAry[13]="";
areaIDPageAry[14]="";
areaIDPageAry[15]="";
areaIDPageAry[16]="";
areaIDPageAry[17]="";
areaIDPageAry[18]="";
areaIDPageAry[19]="";
areaIDPageAry[20]="";
areaIDPageAry[21]="";
areaIDPageAry[22]="";
areaIDPageAry[23]="";
areaIDPageAry[24]="";
areaIDPageAry[25]="";
areaIDPageAry[26]="";
areaIDPageAry[27]="";
areaIDPageAry[28]="";
areaIDPageAry[29]="";
areaIDPageAry[30]="";
areaIDPageAry[31]="";
areaIDPageAry[32]="";
areaIDPageAry[33]="";
areaIDPageAry[34]="";
areaIDPageAry[35]="";
areaIDPageAry[36]="";
areaIDPageAry[37]="";
areaIDPageAry[38]="";
areaIDPageAry[39]="";
areaIDPageAry[40]="";
areaIDPageAry[41]="";
areaIDPageAry[42]="";
areaIDPageAry[43]="";
areaIDPageAry[44]="";
areaIDPageAry[45]="";
areaIDPageAry[46]="";
areaIDPageAry[47]="";
areaIDPageAry[48]="";
areaIDPageAry[49]="";
areaIDPageAry[50]="";
areaIDPageAry[51]="";
areaIDPageAry[52]="";
areaIDPageAry[53]="";
areaIDPageAry[54]="";
areaIDPageAry[55]="";
areaIDPageAry[56]="";
areaIDPageAry[57]="";
areaIDPageAry[58]="";
areaIDPageAry[59]="";
areaIDPageAry[60]="";
areaIDPageAry[61]="";
areaIDPageAry[62]="";
areaIDPageAry[63]="";
areaIDPageAry[64]="";
areaIDPageAry[65]="";
areaIDPageAry[66]="";
areaIDPageAry[67]="";
areaIDPageAry[68]="";
areaIDPageAry[69]="";
areaIDPageAry[70]="";
areaIDPageAry[71]="";
areaIDPageAry[72]="";
areaIDPageAry[73]="";
areaIDPageAry[74]="";
areaIDPageAry[75]="";
areaIDPageAry[76]="";
areaIDPageAry[77]="";
areaIDPageAry[78]="";
areaIDPageAry[79]="";
areaIDPageAry[80]="";
areaIDPageAry[81]="";
areaIDPageAry[82]="";
areaIDPageAry[83]="";
areaIDPageAry[84]="";
areaIDPageAry[85]="";
areaIDPageAry[86]="";
areaIDPageAry[87]="";
areaIDPageAry[88]="";
areaIDPageAry[89]="";
areaIDPageAry[90]="";
areaIDPageAry[91]="";
areaIDPageAry[92]="";
areaIDPageAry[93]="";
areaIDPageAry[94]="";
areaIDPageAry[95]="";
areaIDPageAry[96]="";
areaIDPageAry[97]="";
areaIDPageAry[98]="";
areaIDPageAry[99]="";
areaIDPageAry[100]="";
areaIDPageAry[101]="";
areaIDPageAry[102]="";
areaIDPageAry[103]="";
areaIDPageAry[104]="";
areaIDPageAry[105]="";
areaIDPageAry[106]="";
areaIDPageAry[107]="";
areaIDPageAry[108]="";
areaIDPageAry[109]="";
areaIDPageAry[110]="";
areaIDPageAry[111]="";
areaIDPageAry[112]="";
areaIDPageAry[113]="";
areaIDPageAry[114]="";
areaIDPageAry[115]="";
areaIDPageAry[116]="";
areaIDPageAry[117]="";
areaIDPageAry[118]="";
areaIDPageAry[119]="";
areaIDPageAry[120]="";
areaIDPageAry[121]="";
areaIDPageAry[122]="";
areaIDPageAry[123]="";
areaIDPageAry[124]="";
areaIDPageAry[125]="";
areaIDPageAry[126]="";
areaIDPageAry[127]="";
areaIDPageAry[128]="";
areaIDPageAry[129]="";
areaIDPageAry[130]="";
areaIDPageAry[131]="";
areaIDPageAry[132]="";
areaIDPageAry[133]="";
areaIDPageAry[134]="";
areaIDPageAry[135]="";
areaIDPageAry[136]="";
areaIDPageAry[137]="";
areaIDPageAry[138]="";
areaIDPageAry[139]="";
areaIDPageAry[140]="";
areaIDPageAry[141]="";
areaIDPageAry[142]="";
areaIDPageAry[143]="";
areaIDPageAry[144]="";
areaIDPageAry[145]="";
areaIDPageAry[146]="";
areaIDPageAry[147]="";
areaIDPageAry[148]="";
areaIDPageAry[149]="";
areaIDPageAry[150]="";
areaIDPageAry[151]="";
areaIDPageAry[152]="";
areaIDPageAry[153]="";
areaIDPageAry[154]="";
areaIDPageAry[155]="";
areaIDPageAry[156]="";
areaIDPageAry[157]="";
areaIDPageAry[158]="";
areaIDPageAry[159]="";
areaIDPageAry[160]="";
areaIDPageAry[161]="";
areaIDPageAry[162]="";
areaIDPageAry[163]="";
areaIDPageAry[164]="";
areaIDPageAry[165]="";
areaIDPageAry[166]="";
areaIDPageAry[167]="";
areaIDPageAry[168]="";
areaIDPageAry[169]="";
areaIDPageAry[170]="";
areaIDPageAry[171]="";
areaIDPageAry[172]="";
areaIDPageAry[173]="";
areaIDPageAry[174]="";
areaIDPageAry[175]="";
areaIDPageAry[176]="";
areaIDPageAry[177]="";
areaIDPageAry[178]="";
areaIDPageAry[179]="";
areaIDPageAry[180]="";
areaIDPageAry[181]="";
areaIDPageAry[182]="";
areaIDPageAry[183]="";
areaIDPageAry[184]="";
areaIDPageAry[185]="";
areaIDPageAry[186]="";
areaIDPageAry[187]="";
areaIDPageAry[188]="";
areaIDPageAry[189]="";
areaIDPageAry[190]="";
areaIDPageAry[191]="";
areaIDPageAry[192]="";
areaIDPageAry[193]="";
areaIDPageAry[194]="";
areaIDPageAry[195]="";
areaIDPageAry[196]="";
areaIDPageAry[197]="";
areaIDPageAry[198]="";
areaIDPageAry[199]="";
areaIDPageAry[200]="";
areaIDPageAry[201]="";
areaIDPageAry[202]="";
areaIDPageAry[203]="";
areaIDPageAry[204]="";
areaIDPageAry[205]="";
areaIDPageAry[206]="";
areaIDPageAry[207]="";
areaIDPageAry[208]="";
areaIDPageAry[209]="";
areaIDPageAry[210]="";
areaIDPageAry[211]="";
areaIDPageAry[212]="";
areaIDPageAry[213]="";
areaIDPageAry[214]="";
areaIDPageAry[215]="";
areaIDPageAry[216]="";
areaIDPageAry[217]="";
areaIDPageAry[218]="";
areaIDPageAry[219]="";
areaIDPageAry[220]="";
areaIDPageAry[221]="";
areaIDPageAry[222]="";
areaIDPageAry[223]="";
areaIDPageAry[224]="";
areaIDPageAry[225]="";
areaIDPageAry[226]="";
areaIDPageAry[227]="";
areaIDPageAry[228]="";
areaIDPageAry[229]="";
areaIDPageAry[230]="";
areaIDPageAry[231]="";
areaIDPageAry[232]="";
areaIDPageAry[233]="";
areaIDPageAry[234]="";
areaIDPageAry[235]="";
areaIDPageAry[236]="";
areaIDPageAry[237]="";
areaIDPageAry[238]="";
areaIDPageAry[239]="";
areaIDPageAry[240]="";
areaIDPageAry[241]="";
areaIDPageAry[242]="";
areaIDPageAry[243]="";
areaIDPageAry[244]="";
areaIDPageAry[245]="";
areaIDPageAry[246]="";
areaIDPageAry[247]="";
areaIDPageAry[248]="";
areaIDPageAry[249]="";
areaIDPageAry[250]="";
areaIDPageAry[251]="";
areaIDPageAry[252]="";
areaIDPageAry[253]="";
areaIDPageAry[254]="";
areaIDPageAry[255]="";
areaIDPageAry[256]="";
areaIDPageAry[257]="";
areaIDPageAry[258]="";
areaIDPageAry[259]="";
areaIDPageAry[260]="";
areaIDPageAry[261]="";
areaIDPageAry[262]="";
areaIDPageAry[263]="";
areaIDPageAry[264]="";
areaIDPageAry[265]="";
areaIDPageAry[266]="";
areaIDPageAry[267]="";
areaIDPageAry[268]="";
areaIDPageAry[269]="";
areaIDPageAry[270]="";
areaIDPageAry[271]="";
areaIDPageAry[272]="";
areaIDPageAry[273]="";
areaIDPageAry[274]="";
areaIDPageAry[275]="";
areaIDPageAry[276]="";
areaIDPageAry[277]="";
areaIDPageAry[278]="";
areaIDPageAry[279]="";
areaIDPageAry[280]="";
areaIDPageAry[281]="";
areaIDPageAry[282]="";
areaIDPageAry[283]="";
areaIDPageAry[284]="";
areaIDPageAry[285]="";
areaIDPageAry[286]="";
areaIDPageAry[287]="";
areaIDPageAry[288]="";
areaIDPageAry[289]="";
areaIDPageAry[290]="";
areaIDPageAry[291]="";
areaIDPageAry[292]="";
areaIDPageAry[293]="";
areaIDPageAry[294]="";
areaIDPageAry[295]="";
areaIDPageAry[296]="";
areaIDPageAry[297]="";
areaIDPageAry[298]="";
areaIDPageAry[299]="";
areaIDPageAry[300]="";

//比较两个ip的大小,如果大于，返回1，等于返回0，小于返回-1
function compareIP(ipBegin, ipEnd){
	if(ipBegin == '' && ipEnd == '') return 0;
	var temp1;
	var temp2;
	temp1 = ipBegin.split(".");
	temp2 = ipEnd.split(".");
	for (var i = 0; i < 4; i++){
		if (parseInt(temp1[i])>parseInt(temp2[i])){
			return 1;
		}  
		else if (parseInt(temp1[i])<parseInt(temp2[i])){
			return -1;
		}
	}
	return 0;
}


//获取虚拟机器编号--2015-10-14
function getVirtualMachineno(machineno, vlanid, ip, ssid, areaID){
	var tempMachineno = "";
	if(pageSetting == 1){// vlan
		for(var i=1; i<vlanPageAry.length; i++){
			if(vlanPageAry[i] != ''){
				var option_array = vlanPageAry[i].split("|");
				if(parseInt(vlanid) >= parseInt(option_array[1]) && parseInt(vlanid) <= parseInt(option_array[2]) && option_array[5]=='1'){
					tempMachineno = option_array[3];
					break;
				}
			}
		}
	}
	else if(pageSetting == 2){// ip
		for(var i=1; i<ipPageAry.length; i++){
			if(ipPageAry[i] != ''){
				var option_array = ipPageAry[i].split("|");
				if(compareIP(ip, option_array[1]) >=0 && compareIP(ip, option_array[2]) <=0 && option_array[5]=='1'){
					tempMachineno = option_array[3];
					break;
				}
			}
		}
	}
	else if(pageSetting == 3){// ssid
		for(var i=1; i<ssidPageAry.length; i++){
			if(ssidPageAry[i] != ''){
				var option_array = ssidPageAry[i].split("|");
				if(ssid == option_array[1] && option_array[4]=='1'){
					tempMachineno = option_array[2];
					break;
				}
			}
		}
	}else if(pageSetting == 4){//Area ID
		for(var i=1; i<areaIDPageAry.length; i++){
			if(areaIDPageAry[i] != ''){
				var option_array = areaIDPageAry[i].split("|");
				if(areaID == option_array[1] && option_array[4]=='1'){
					tempMachineno = option_array[2];
					break;
				}
			}
		}
	}
	if(tempMachineno == '') return machineno; 
	return tempMachineno;
}

//获取匹配页面编号--2015-10-14
function getMatchPage(vlanid, ip, ssid, areaID){
	var tempMatchPage = 0;
	if(pageSetting == 1){// vlan
		for(var i=1; i<vlanPageAry.length; i++){
			if(vlanPageAry[i] != ''){
				var option_array = vlanPageAry[i].split("|");
				if(parseInt(vlanid) >= parseInt(option_array[1]) && parseInt(vlanid) <= parseInt(option_array[2]) && option_array[5]=='1'){
					tempMatchPage = i;
					break;
				}
			}
		}
	}
	else if(pageSetting == 2){// ip
		for(var i=1; i<ipPageAry.length; i++){
			if(ipPageAry[i] != ''){
				var option_array = ipPageAry[i].split("|");
				if(compareIP(ip, option_array[1]) >=0 && compareIP(ip, option_array[2]) <=0 && option_array[5]=='1'){
					tempMatchPage = i;
					break;
				}
			}
		}
	}
	else if(pageSetting == 3){// ssid
		for(var i=1; i<ssidPageAry.length; i++){
			if(ssidPageAry[i] != ''){
				var option_array = ssidPageAry[i].split("|");
				if(ssid == option_array[1] && option_array[4]=='1'){
					tempMatchPage = i;
					break;
				}
			}
		}
	}
	else if(pageSetting == 4){ // area ID
		for(var i=1; i<areaIDPageAry.length; i++){
			if(areaIDPageAry[i] != ''){
				var option_array = areaIDPageAry[i].split("|");
				if(areaID == option_array[1] && option_array[4]=='1'){
					tempMatchPage = i;
					break;
				}
			}
		}
	}
	return tempMatchPage;
}

//获取重定向地址--2015-10-14
function getRedirectLink(vlanid, ip, ssid){
	var tempRedirectLink = "";
	if(pageSetting == 1){// vlan
		for(var i=1; i<vlanPageAry.length; i++){
			if(vlanPageAry[i] != ''){
				var option_array = vlanPageAry[i].split("|");
				if(parseInt(vlanid) >= parseInt(option_array[1]) && parseInt(vlanid) <= parseInt(option_array[2]) && option_array[5]=='1'){
					tempRedirectLink = option_array[4];
					break;
				}
			}
		}
	}
	else if(pageSetting == 2){// ip
		for(var i=1; i<ipPageAry.length; i++){
			if(ipPageAry[i] != ''){
				var option_array = ipPageAry[i].split("|");
				if(compareIP(ip, option_array[1]) >=0 && compareIP(ip, option_array[2]) <=0 && option_array[5]=='1'){
					tempRedirectLink = option_array[4];
					break;
				}
			}
		}
	}
	else if(pageSetting == 3){// ssid
		for(var i=1; i<ssidPageAry.length; i++){
			if(ssidPageAry[i] != ''){
				var option_array = ssidPageAry[i].split("|");
				if(ssid == option_array[1] && option_array[4]=='1'){
					tempRedirectLink = option_array[3];
					break;
				}
			}
		}
	}
	else if(pageSetting == 4){//area id 
		for(var i=1; i<areaIDPageAry.length; i++){
			if(areaIDPageAry[i] != ''){
				var option_array = areaIDPageAry[i].split("|");
				if(ssid == option_array[1] && option_array[4]=='1'){
					tempRedirectLink = option_array[3];
					break;
				}
			}
		}
	}
	return tempRedirectLink;
}

//获取当前的匹配类型：vlan | ssid | ip
function getPageType() {
	var pageType = ""; //-----------------
	if (pageSetting == 1) {
		pageType = "vlan";
	}
	else if (pageSetting == 2) {
		pageType = "ip";
	}
	else if(pageSetting == 3){
		pageType = "ssid";
	}
	else if(pageSetting == 4){
		pageType = "areaID";
	}
	return pageType;
}

//公用函数，帮助取得url的查询的各类参数的值，只需输入参数名就可以了
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

//获取登录方式，以什么方法登陆 返回为0,1,2,3.....
function getLoginMethod(pageIndex){
	var paraStr="0";
	if (pageSetting == 1) {
		paraStr = vlanPageAry[pageIndex];
	}
	else if (pageSetting == 2) {
		paraStr = ipPageAry[pageIndex];
	}
	else if(pageSetting == 3){
		paraStr = ssidPageAry[pageIndex];
	}
	else if(pageSetting == 4){
		paraStr = areaIDPageAry[pageIndex];
	}
	var paraArr = paraStr.split("|");
	var l=paraArr.length-1;
	return paraArr[l];
}