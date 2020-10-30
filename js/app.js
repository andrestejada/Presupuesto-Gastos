//Variable y selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')

//Eventos
EventListener()

function EventListener(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto)
    formulario.addEventListener('submit',agregarGasto)
}

//clases

class Presupuesto {

    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos =[]
    }

    nuevoGasto(gasto){

       this.gastos = [...this.gastos,gasto]
       this.calcularRestante()
    }

    calcularRestante(){
        const gastado =this.gastos.reduce((total,gasto)=> total + gasto.cantidad , 0 )
        this.restante = this.presupuesto - gastado
    }


    eliminarGasto(id){
        this.gastos = this.gastos.filter((gasto)=> gasto.id !== id)
        this.calcularRestante()

    }


}




let presupuesto;

class UI {

    insertarPresupuesto(cantidad){
        const {presupuesto,restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }

    imprimirAlerta(mensaje,tipo){
        //crear el div
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('alert','text-center');

        //validar
        if(tipo ==='error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }

        //crear el html
        divMensaje.textContent = mensaje
        document.querySelector('.primario').insertBefore(divMensaje,formulario)
        //eliminar el mensaje pasado 3 segudos
        setTimeout(()=>{
            divMensaje.remove()
        },3000)
    }

    mostrarGasto(gastos){

        //limpia el html previo
        this.limpiarHtml()

        //itera sobre cada gasto
        gastos.forEach(gasto => {
            //crear un nuevo LI
            const {nombre,cantidad,id} = gasto
            const nuevoGasto= document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            //CREAR HTML

            nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}</span>`

            //crear un boton para borrar los elementos
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times'
            btnBorrar.onclick = ()=>{
                eliminarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar)

            //agregar al Html
            gastoListado.appendChild(nuevoGasto)

           
            }
        )}

        limpiarHtml(){
            while(gastoListado.firstChild){
                gastoListado.removeChild(gastoListado.firstChild)
                  }
          }
          
          
        actualizarRestante(restante){
            document.querySelector('#restante').textContent = restante 
        }
        
        comprobarPresupuesto(presupuestoObj){
            const {presupuesto,restante}= presupuestoObj
            const divRestante = document.querySelector('.restante')
            //comprobar 25%
            if( ( presupuesto / 4) > restante ){
                divRestante.classList.remove('alert-success','alert-warning');
                divRestante.classList.add('alert-danger');
            } else if( (presupuesto/2) > restante ){
                divRestante.classList.remove('alert-success');
                divRestante.classList.add('alert-warning');
            }else{
                divRestante.classList.remove('alert-danger','alert-warning');
                divRestante.classList.add('alert-success');
            }


            //comprobar si el restante es menor que 0

            if(restante <= 0){
                ui.imprimirAlerta('El presupuesto se ha agotado','error');
                formulario.querySelector('button[type="submit"]').disabled = true
            }
        }
}

// instanciar UI

const ui = new UI();


//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario =  prompt('Cual es tu presupuesto?')

    if(presupuestoUsuario === "" ||presupuestoUsuario=== null||isNaN(presupuestoUsuario||presupuestoUsuario <= 0)){
        window.location.reload()
    }

    //presupuesto valido

    presupuesto = new Presupuesto(presupuestoUsuario)

    ui.insertarPresupuesto(presupuesto)
    
}


function agregarGasto (e){
    e.preventDefault()

    //leer datos de formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar
    if(nombre ===""||cantidad===""){
        ui.imprimirAlerta('Ambos campos son obligatorio','error')
        return
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida','error')
        return
    }

    //Generar un Objeto con el Gasto

   const gasto = { nombre , cantidad,id:Date.now()}

    //generar un nuevo gasto
    presupuesto.nuevoGasto(gasto)

    //mensaje de exito
    ui.imprimirAlerta('Gasto agregado correctamente')
    //impirmir los gastos
   
    const {gastos , restante}=presupuesto
    ui.mostrarGasto(gastos)

    //resta el presupuesto y muestra el valor restante
    ui.actualizarRestante(restante)

    //poner en colores el restante
    ui.comprobarPresupuesto(presupuesto)
    //resetear el formulario
    formulario.reset()
}


function eliminarGasto(id){
    //elimana el gasto del objeto
    presupuesto.eliminarGasto(id)
    //eliman el gasto del HTML
    const {gastos,restante} = presupuesto
    ui.mostrarGasto(gastos)

    ui.actualizarRestante(restante)

    //poner en colores el restante
    ui.comprobarPresupuesto(presupuesto)

}