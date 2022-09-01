export class CompagniaAerea{
    public username : string;
    public password : string | null;
    public nome : string | null;
    public nazione : string;
    public sede : string;

    constructor(){
        this.nazione='';
        this.nome=null;
        this.sede='';
        this.username='';
        this.password=null;
    }
}