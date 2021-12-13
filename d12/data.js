const rtestdata = 
`start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

const rtestData2 = 
`dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

const rtestData3 = 
`fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

const rdata = 
`kc-qy
qy-FN
kc-ZP
end-FN
li-ZP
yc-start
end-qy
yc-ZP
wx-ZP
qy-li
yc-li
yc-wx
kc-FN
FN-li
li-wx
kc-wx
ZP-start
li-kc
qy-nv
ZP-qy
nv-xr
wx-start
end-nv
kc-nv
nv-XQ`;

const datasets = {rtestdata, rtestData2, rtestData3, rdata};




// TESTS
let outP2_1 = [
    "start,A,c,A,c,A,b,A,b,A,end",
    "start,A,c,A,c,A,b,A,b,end",
    "start,A,c,A,c,A,b,A,end",
    "start,A,c,A,c,A,b,d,b,A,end",
    "start,A,c,A,c,A,b,d,b,end",
    "start,A,c,A,c,A,b,end",
    "start,A,c,A,c,A,end",
    "start,A,c,A,b,A,c,A,b,A,end",
    "start,A,c,A,b,A,c,A,b,end",
    "start,A,c,A,b,A,c,A,end",
    "start,A,c,A,b,A,b,A,c,A,end",
    "start,A,c,A,b,A,b,A,end",
    "start,A,c,A,b,A,b,end",
    "start,A,c,A,b,A,end",
    "start,A,c,A,b,d,b,A,c,A,end",
    "start,A,c,A,b,d,b,A,end",
    "start,A,c,A,b,d,b,end",
    "start,A,c,A,b,end",
    "start,A,c,A,end",
    "start,A,b,A,c,A,c,A,b,A,end",
    "start,A,b,A,c,A,c,A,b,end",
    "start,A,b,A,c,A,c,A,end",
    "start,A,b,A,c,A,b,A,c,A,end",
    "start,A,b,A,c,A,b,A,end",
    "start,A,b,A,c,A,b,end",
    "start,A,b,A,c,A,end",
    "start,A,b,A,b,A,c,A,c,A,end",
    "start,A,b,A,b,A,c,A,end",
    "start,A,b,A,b,A,end",
    "start,A,b,A,b,end",
    "start,A,b,A,end",
    "start,A,b,d,b,A,c,A,c,A,end",
    "start,A,b,d,b,A,c,A,end",
    "start,A,b,d,b,A,end",
    "start,A,b,d,b,end",
    "start,A,b,end",
    "start,A,end",
    "start,b,A,c,A,c,A,b,A,end",
    "start,b,A,c,A,c,A,b,end",
    "start,b,A,c,A,c,A,end",
    "start,b,A,c,A,b,A,c,A,end",
    "start,b,A,c,A,b,A,end",
    "start,b,A,c,A,b,end",
    "start,b,A,c,A,end",
    "start,b,A,b,A,c,A,c,A,end",
    "start,b,A,b,A,c,A,end",
    "start,b,A,b,A,end",
    "start,b,A,b,end",
    "start,b,A,end",
    "start,b,d,b,A,c,A,c,A,end",
    "start,b,d,b,A,c,A,end",
    "start,b,d,b,A,end",
    "start,b,d,b,end",
    "start,b,end"
];

const outP2_th = [
    "start,A,b,A,b,A,c,A,end",
    "start,A,b,A,b,A,end",
    "start,A,b,A,b,end",
    "start,A,b,A,c,A,b,A,end",
    "start,A,b,A,c,A,b,end",
    "start,A,b,A,c,A,c,A,end",
    "start,A,b,A,c,A,end",
    "start,A,b,A,end",
    "start,A,b,d,b,A,c,A,end",
    "start,A,b,d,b,A,end",
    "start,A,b,d,b,end",
    "start,A,b,end",
    "start,A,c,A,b,A,b,A,end",
    "start,A,c,A,b,A,b,end",
    "start,A,c,A,b,A,c,A,end",
    "start,A,c,A,b,A,end",
    "start,A,c,A,b,d,b,A,end",
    "start,A,c,A,b,d,b,end",
    "start,A,c,A,b,end",
    "start,A,c,A,c,A,b,A,end",
    "start,A,c,A,c,A,b,end",
    "start,A,c,A,c,A,end",
    "start,A,c,A,end",
    "start,A,end",
    "start,b,A,b,A,c,A,end",
    "start,b,A,b,A,end",
    "start,b,A,b,end",
    "start,b,A,c,A,b,A,end",
    "start,b,A,c,A,b,end",
    "start,b,A,c,A,c,A,end",
    "start,b,A,c,A,end",
    "start,b,A,end",
    "start,b,d,b,A,c,A,end",
    "start,b,d,b,A,end",
    "start,b,d,b,end",
    "start,b,end",
]