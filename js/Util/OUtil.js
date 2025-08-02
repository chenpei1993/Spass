export class OUtil{
    static isNull(o){
        return o === null
    }

    static isUndefined(o){
        return o === undefined
    }

    static isNotBlank(o){
        let res = (!OUtil.isNull(o))  && (!OUtil.isUndefined(o))
        // TODO
        // if(o instanceof String){
        //
        // }
        //
        if(o instanceof Array){
            res = res && (o.length !== 0)
        }
        return res
    }
}


