/** 
* @module jsmat/data
*/


export function array_map(Fun,Arr){
    var i, R = new Array(Arr.length);
    for (i=0;i<Arr.length;i++)
        R[i] = Fun(Arr[i],i);
    return R;
};

export function array2d_col(arr,idx) {
    var len = arr.length;
    var r = new Array(len);
    for(var i=0; i<len; i++)
        r[i]=arr[i][idx];
    return r;
}


export const cmp ={ 
    number: function(A, B) { return A-B; },
    string: function(A, B) { return A.localeCompare(B); },
    any: function(A, B) { return A.toString().localeCompare(B.toString()); }
}


export class Table {

    constructor(Name, Header){
        this.name = Name;
        this.header = Header || [];
        this.data = [];
        this.sorted = -1; // sorted column
    }

    clear() {
        this.data = [];
        this.sorted = -1;
    }

    length() {
        return this.data.length;
    }

    add_colum(Name,Data) {
        this.header.push(Name);
        var Pos = this.header.length -1;
        for (var i=0;i<this.data.length; i++){
            if(Data && Data[i]) {
                this.data[i][Pos] = Data[i];
            } else {
                this.data[i][Pos] = undefined;
            }
        }
    }

    get_colum (name) {
        var i, r = new Array(this.data.length), col = (typeof name == "string") ? this.header.indexOf(name) : name;
        for( i=0; i<this.data.length; i++){
            r[i] = this.data[i][col];
        }
        return r;
    }

    map(Fun, target, inputs, start, end){
        if (end == undefined || end > this.data.length || end < 0) end = this.data.length;
        if (start == undefined) start = 0;
            
        var data = this.data, b;        
        
        if(target){
            if (typeof target == "string") target = this.header.indexOf(target);
            if(inputs){
                inputs = array_map(function(d){ 
                        return (typeof d == "string") ? this.header.indexOf(d) : d; 
                    },inputs);
                for (var i=start; i<end; i++){
                    b = array_map( function(ii){return this[ii];}.bind(data[i]),inputs);
                    data[i][target] = Fun.apply(null,b.concat([data[i],i]));
                }
            } else {
                for (i=offset; i<length; i++){
                    data[i][target] = Fun(data[i],i);
                }
            }
        } else {
            for (var i = start; i < end; i++) {
                data[i] = Fun(data[i],i);
            }
        }
    }

    // deprecated
    map1(Fun, offset, length) {
        if (length == undefined || length > this.data.length || length < 0) length = this.data.length;
        if (offset == undefined) offset = 0;
        var Data = this.data, i;
        for (i = offset; i < length; i++) {
            Data[i] = Fun(Data[i],i);
        }
    }

    // deprecated
    map2(Fun, Target, offset, length){
        if (length == undefined || length > this.data.length) length = this.data.length;
        if (offset == undefined) offset = 0;
        var i, Data = this.data, col = (typeof Target == "string") ? this.header.indexOf(Target) : Target;
        for (i=offset;i<length;i++){
            Data[i][col] = Fun(Data[i],i);
        }
    }

    // deprecated
    map3(Fun,Target,Inputs, offset, length){
        if (length == undefined || length > this.data.length) length = this.data.length;
        if (offset == undefined) offset = 0;
        var Data = this.data, i, B,
            In = array_map(function(D){
                return (typeof D == "string") ? this.header.indexOf(D) : D; },Inputs),
            col = (typeof D == "string") ? this.header.indexOf(Target) : Target;
        for (i=offset;i<length;i++){
            B = array_map( function(I){return this[I];}.bind(Data[i]),In);
            Data[i][col] = Fun.apply(null,[Data[i]].concat(B));
        }
    }

    fold(Fun, acc, inputs, start, end){
        if (end == undefined || end > this.data.length || end < 0) end = this.data.length;
        if (start == undefined) start = 0;
            
        var data = this.data, b; 
        if(inputs){
            inputs = array_map(function(D){
                return (typeof d == "string") ? this.header.indexOf(d) : d; },inputs);
            for (i = 0; i < Data.length; i++) {
                b = array_map( function(ii){ return this[ii]; }.bind(Data[i]), inputs);
                b = [acc].concat(b);
                acc = Fun.apply(null,b.concat([data[i],i]));
            }
        } else {
            for (var i = 0; i < Keys.length; i++) {
                acc = Fun(acc,Data[i],i);
            } 
        }
        return acc;
    }
      
    // deprecated
    fold1(Fun, Acc){
        var Data = this.data, i;
        for (i = 0; i < Keys.length; i++) {
            Acc = Fun(Data[i],Acc);
        }
        return Acc;
    }

    // deprecated
    fold3(Fun, Acc, Inputs) {
        var Data = this.data, i, B,
            In = array_map(function(D){
                return (typeof D == "string") ? this.header.indexOf(D) : D; },Inputs);
        for (i = 0; i < Data.length; i++) {
            B = array_map( function(I){return this[I];}.bind(Data[i]),In);
            B.push(Acc);
            Acc = Fun.apply(null,B);
        }
        return Acc;
    }

    /**
     * Filter table and create a new table with filtered data
     * @param {*} Cmp 
     * @param {*} input 
     * @param {*} query 
     */
    filter(Cmp,input,query){
        if (typeof input == "string") input = this.header.indexOf(input);
        var out = new Table(this.name+" filter",this.header.slice(0));
        var data = this.data, i;
        
        if (input){
            for (i = 0; i < Data.length; i++) {
                if (0 == Cmp(Data[i][input],query))
                    Out.data.push(Data[i]);
            }
        } else {
            for (i = 0; i < Data.length; i++) {
                if (0 == Cmp(Data[i],query))
                    Out.data.push(Data[i]);
            }
        }
        return Out;
    }
    
    /**
     * seclect colums and rows with a filter 
     * @param {*} Fun 
     * @param {*} input 
     * @param {*} query 
     */
    select(Fun,input,query){
        var Data = this.data, i, B, R,
            In = array_map(function(D){
                return (typeof D == "string") ? header.indexOf(D) : D; },Select);
        var Out = init(this.name+" filter",array_map(function(I){return this.header[I]},In));
        for (i = 0; i < Data.length; i++) {
            B = array_map( function(I){return this[I];}.bind(Data[i]),In);
            B.push(Query);
            R = Fun.apply(null,B);
            if(R)
                Out.data.push(R);
        }
        return Out;
    }

    /**
     * Reduce table 
     * @param {*} Fun 
     * @param {*} input 
     */
    reduce(Fun,input){
        var Cidx = (typeof Colum === "string" ) ? this.header.indexOf(Colum) : Colum;
        if (!this.sorted || this.sorted != Cidx)
            this.sort(Fun,Cidx);
        var Data = this.data, i;
        var Last=Data[0][Cidx], Out = new Table(this.name+" reduce "+Colum,this.header.slice(0));
        Out.data.push(Data[0]);
        for (i = 1; i < Data.length; i++) {
            if (0 != Fun(Data[i][Cidx],Last))
                Out.data.push(Data[i]);
            Last = Data[i][Cidx];
        }
        return Out;
    }
     
    //// SORT AND SEARCH WITH HELPERS
    
    sort(Fun, Colum){
        var Cidx = (typeof Colum === "string" ) ? this.header.indexOf(Colum) : Colum;
        var Cmp = function(A,B) {
            return this.cmp(A[this.idx],B[this.idx]);
        }
        this.data = this.data.sort(Cmp.bind({idx: Cidx, cmp: Fun}));
        this.sorted = Cidx;
        return Cidx;
    }
      
    search_and_get(Fun,Value,Colum,Key){
        var Idx = this.search(Fun,Value,Colum);
        if (Idx >= 0) {
            var Cidx = (typeof Key === "string" ) ? this.header.indexOf(Key) : Key;
            return this.data[Idx][Cidx];
        }
    }
      
    search(Fun,Value,Colum){
        var Cidx;
        if (typeof Colum === "string" )
            Cidx = this.header.indexOf(Colum);
        else
            Cidx = Colum;
        if( this.sorted && this.sorted == Cidx ){ //binary binsearch
            return this.binsearch(Fun, Value, Cidx);
        } else {
            var i, Data=this.data;
            for (i=0; i<Data.length; i++){
                if(0 == Fun(Data[i][Cidx],Value)){
                    return i;
                }
            }
        }
        return -1;
    }
      
    binary_search(Fun,Value,Colum){
        var Cidx = (typeof Colum === "string" ) ? this.header.indexOf(Colum) : Colum;
        if (!this.sorted || this.sorted != Cidx)
            sort(Fun,Cidx,this);
        return this.binsearch(Fun, Value, Cidx);
    }
      
    binsearch(Fun, Value, Cidx){
        var Left = 0, Right = this.data.length - 1, Mid, R, Data = this.data;
        while (Left <= Right) { // Interval
          Mid = Left + ((Right - Left) / 2); // half interval
          //console.log(Value,Data[Mid]);
          R = Fun(Value,Data[Mid][Cidx]);
          if (R == 0) // success
            return Mid;
          else
            if (R < 0) // lower interval
              Right = Mid - 1;
            else // higher interval
              Left = Mid + 1;
        }
        return -1;
    }

    get_row_obj(Row){
        var Obj = {};
        for(var i=0; i<this.header.length; i++){
            Obj[this.header[i]] = this.data[Row][i];
        }
        return Obj
    }

    add_row_obj(Obj,Idx = -1) {
        var Keys = Object.keys(Obj);
        if (Idx < 0){
            Idx = this.data.length;
            this.data.push(new Array(this.header.length));
        }

        for(var i=0; i<Keys.length; i++ ){
            var Pos = this.header.indexOf(Keys[i]);
            if(Pos == -1){
                console.log("TR_Table: Missing key: "+Keys[i]);
            } else {
                this.data[Idx][Pos] = Obj[Keys[i]];
            }
        }
    }
     
    add_obj_array(Obj) {
         var i,j, L, Keys, Idx;
         for(i=0; i<Obj.length; i++){
            L = new Array(this.header.length);
            Keys = Object.keys(Obj[i]);
            for(j=0; j<Keys.length; j++ ){
                Idx = this.header.indexOf(Keys[j]);
                if (Idx >=0 ) {
                    L[Idx] = Obj[i][Keys[j]];
                }
            }
            this.data.push(L);
        }
    }

    read_json(text) {
        var l, i, j, json = JSON.parse(text);
        for(i=0; i < json.length; i++){
            l = new Array(this.header.length);
            for(j=0; j<this.header.length; j++ ){
                l[j] = json[i][this.header[j]];
            }
            this.data.push(l);
        }
        
    }

    read_csv(Text, FS, No_Header) {
        var Last_Char = "", Field = "", Obj = [""], Col = 0, Row = 0, No_Quote = !0, C, j, First_Row = (No_Header)? 0 : !0;
        this.data = [];
        this.header = [];
        this.sorted = -1;
        this.data.push(Obj);
    
        for (j = 0; j < Text.length; j++) {
            C = Text[j]; //get current char
            if ("\"" === C) { // if quote
                if (No_Quote && C === Last_Char)
                    Field += C; // if previous was a quote add quote to field string
                No_Quote = !No_Quote; // switch boolean
            }
            else if (FS === C && No_Quote) { // if not quoted FS
                if (First_Row) {
                    this.header[Col++] = Field;
                }
                else {
                    Obj[Col++] = Field;
                }
                C = Field = "";
            }
            else if ("\n" === C && No_Quote) { // if not quoted line end
                    if ("\r" === Last_Char)
                        Field = Field.slice(0, -1); //remove carriage return
                    if (First_Row) {
                        First_Row = !First_Row;
                        this.header[Col] = Field;
                        C = Field = "";
                    }
                    else {
                        Obj[Col] = Field;
                        this.data[++Row] = Obj = [];
                    }
                    C = Field = "";
                    Col = 0;
                }
                else {
                    Field += C;
                }
                Last_Char = C;
        }
        if (Col != 0) {
            Obj[Col] = Field;
        }
        if (Obj.length != this.header.length)
            this.data.pop();
    }
    
    write_csv(FS) {
        var text = "", row;
        if (this.header) {
            for (var i = 0; i < this.header.length; i++) {
                if (i > 0)
                    text += FS;
                text += escape_csv(this.header[i], FS);
            }
            text += "\r\n";
        }
        for (var i = 0; i < this.data.length; i++) {
            row = this.data[i];
            for (var j = 0; j < row.length; j++) {
                if (j > 0)
                    text += FS;
                text += escape_csv(str(row[j]), FS);
            }
            text += "\r\n";
        }
        return text;
    }
};



// HELPER FUNCTIONS

function escape_csv(Value, FS) {
    var R = "", C, Esc = false;
    if (!Value)
        return "";
    for (var j = 0; j < Value.length; j++) {
        C = Value[j];
        if (C == "\"") {
            R += C;
            R += C;
            Esc = true;
        }
        else if (C == "\n" || C == "\r" || C == FS) {
            R += C;
            Esc = true;
        }
        else {
            R += C;
        }
    }
    if (Esc) {
        return "\"" + R + "\"";
    }
    else {
        return R;
    }
}

function str(o) {
    switch (o) {
        case null:
          return "null";
        case undefined:
          return "undefined";
        default:
          return o.toString();
    }
}