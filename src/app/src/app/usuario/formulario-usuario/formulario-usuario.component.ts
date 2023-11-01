import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.scss']
})
export class FormularioUsuarioComponent {
  usuarioForm: FormGroup = new FormGroup({});
  confirmacaoSenha = '';
  showPassword = false;
  showPasswordConfirm = false;

  @Output() recarregarTabelaEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private snackBar: MatSnackBar) {
    this.iniciarFormulario();
  }

  private iniciarFormulario(): void {
    this.usuarioForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmaSenha: ['', [Validators.required, Validators.maxLength(20)]]
    }, { validator: this.senhasCoincidemValidator });
  }

  private senhasCoincidemValidator(group: FormGroup): any {
    const senhaControl = group.get('senha');
    const confirmaSenhaControl = group.get('confirmaSenha');
    let retorno: any = null;

    if (senhaControl && confirmaSenhaControl) {
      const senha = senhaControl.value;
      const confirmaSenha = confirmaSenhaControl.value;

      if (senha !== confirmaSenha) {
        retorno = { senhasNaoCoincidem: true };
      }
    }
    return retorno;
  }

  alternarVisibilidadeSenha() {
    this.showPassword = !this.showPassword;
  }

  alternarVisibilidadeConfirmacaoSenha() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      this.usuarioService.criarUsuario(this.usuarioForm.value).subscribe(
        () => {
         this.mostrarNotificacao('Usuário criado com sucesso!');
        },
        (error) => {
          this.mostrarNotificacao('Erro ao criar usuário!');
          console.error('Erro ao criar usuário:', error);
        }
      );
      this.usuarioForm.reset();
      this.recarregarTabelaEvent.emit(true);
    }
  }

  private mostrarNotificacao(msg: string): void {
    this.snackBar.open(msg, 'Fechar', {
      duration: 3000
    });
  }

}
