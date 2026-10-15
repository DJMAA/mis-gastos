# Instrucciones para agregar «Pánico DYM» a Mis Gastos

Hola. Te paso el código fuente de mi aplicación **Mis Gastos** (versión PC y Android) y necesito
que le agregues una función nueva llamada **«Pánico DYM»**. Su objetivo es ayudarme a no ver
pornografía: bloquear páginas y aplicaciones y, cuando intente entrar, mostrarme un mensaje de
ánimo con un versículo de la Biblia.

## Lo que ya sé de la app

- **PC:** Python 3.14 + pywebview, empaquetada como `.exe` con PyInstaller. Tiene módulos como
  `app.py`, `model.py`, `cartolas.py`, `actualizaciones.py`, `gcal.py`, `excel_io.py`,
  `login_google.py` y `notificar.py`.
- **Interfaz:** HTML/JS. Se distribuye aparte como `ui-X.Y.Z.zip`, con `sha256` y firma digital
  (campo `firma`), declarado en `actualizacion.json` del repositorio `DJMAA/mis-gastos`.
- **Android:** APK aparte (`MisGastos-X.Y.Z.apk`).
- **Publicación:** el repositorio `DJMAA/mis-gastos` tiene `VERSION` (con notas de la versión) y
  `actualizacion.json` (versión, fecha, notas, url, sha256 y firma de UI, Android y PC).
  Respeta ese formato y el sistema de firmas. No lo desactives.

## Ya existe una extensión de navegador (úsala como base)

En la carpeta `panico-dym/` del repositorio `DJMAA/mis-gastos` (rama `ccr-0f31eb66-kb7phs`) hay
una extensión para Chrome y Edge (Manifest V3) que ya funciona y está probada:

- `datos.js`: lista de páginas, palabras clave, horario por defecto y versículos.
- `background.js`: crea reglas `declarativeNetRequest` que redirigen las páginas bloqueadas a
  `bloqueo.html`. Revisa el horario cada minuto con `chrome.alarms`.
- `bloqueo.html/.js/.css`: la pantalla con el mensaje, el versículo y los botones.
- `opciones.html/.js`: lista editable, horario y PIN (guardado como hash SHA-256).
- `popup.html/.js`: muestra el estado y abre las opciones.

Una app de escritorio no puede ver lo que se abre en Chrome o Edge. Por eso, en PC el bloqueo de
páginas lo hace esta extensión, y Mis Gastos solo la administra.

## Qué necesito que hagas

### 1. Dentro de Mis Gastos (PC y Android)
- Un botón o sección **«Pánico DYM»** en el menú principal.
- **Botón de pánico:** abre al instante la pantalla de ánimo (ver punto 4), para cuando sienta la
  tentación aunque no esté navegando.
- **Configuración:**
  - Cuadro de texto con la **lista de páginas** (una por línea) y botón «Restaurar lista recomendada».
  - Cuadro de texto con las **palabras clave** (una por línea).
  - **Horario:** «Siempre activo» (recomendado) o «Solo de HH:MM a HH:MM». Puede cruzar la
    medianoche, por ejemplo de 22:00 a 06:00.
  - **PIN** opcional (guardado como hash, nunca en texto plano). Se pide para cambiar la
    configuración o desactivar el bloqueo. Lo guardará otra persona de confianza.
- Guarda la configuración en el mismo lugar donde la app guarda sus datos.

### 2. PC (Windows)
- Que la extensión `panico-dym` use la misma configuración que la app. Por ejemplo, la app puede
  servirla en `http://127.0.0.1:<puerto>/panico.json` y la extensión leerla periódicamente. Si
  la app no está abierta, la extensión usa la última copia que tenga guardada.
- Un botón **«Instalar extensión»** con instrucciones paso a paso: `chrome://extensions` → Modo
  de desarrollador → Cargar descomprimida → elegir la carpeta, y activar «Permitir en incógnito».
- Un botón **«Activar DNS con filtro»** que configure el DNS de Windows en `1.1.1.3` y `1.0.0.3`
  (Cloudflare para familias), pidiendo permisos de administrador, y otro botón para restaurarlo.
  Debe avisar que hay que desactivar el «DNS seguro» de Chrome o Edge, o configurarlo con Cloudflare.
- Opcional: con permisos de administrador, agregar las páginas al archivo `hosts` como respaldo.

### 3. Android
- Un **servicio de accesibilidad** que:
  - Detecte las **apps bloqueadas** (el usuario las elige de una lista de apps instaladas) dentro
    del horario y las tape de inmediato con la pantalla de ánimo. La app no se debe poder usar.
  - Lea la **barra de direcciones** de los navegadores (Chrome, Samsung Internet, Firefox, Edge,
    Opera, Brave) y, si la dirección coincide con una página de la lista o contiene una palabra
    clave, muestre la pantalla de ánimo encima y mande al usuario al inicio.
- Pantalla para pedir el permiso de accesibilidad, explicando para qué es.
- Que se reactive solo al reiniciar el teléfono.
- Opcional: botón que explique cómo poner el **DNS privado**
  `family-filter-dns.cleanbrowsing.org` en Ajustes → Redes.
- Ojo: Google Play revisa mucho el uso de accesibilidad. Si la app no se publica en Play Store
  (se instala el APK directo), no hay problema.

### 4. Pantalla de ánimo (igual en todas las plataformas)
- Fondo oscuro y tranquilo (azul noche).
- Título: **«🛑 No lo hagas. No dejes que el enemigo te domine.»**
- Subtítulo: «Respira. Este momento pasa. Tú eres más fuerte en Cristo.»
- Un **versículo al azar** de la lista de abajo, sin repetir el anterior.
- Botones:
  - **Salir de aquí:** cierra la página o app y va al inicio.
  - **Orar un minuto:** cuenta regresiva de 60 segundos con esta oración: «Señor, en este
    momento te entrego mi mente y mis ojos. Dame fuerzas para resistir y llena mi corazón de tu
    paz. Gracias porque tu gracia me basta. En el nombre de Jesús, amén.»
  - **Otro versículo.**
  - **Llamar a mi apoyo** (solo en Android): llama a un contacto de confianza elegido en la
    configuración.

## Lista recomendada de páginas

```
pornhub.com
xvideos.com
xnxx.com
xhamster.com
redtube.com
youporn.com
tube8.com
spankbang.com
eporner.com
txxx.com
hqporner.com
porntrex.com
beeg.com
tnaflix.com
motherless.com
brazzers.com
realitykings.com
bangbros.com
onlyfans.com
fansly.com
chaturbate.com
stripchat.com
bongacams.com
cam4.com
livejasmin.com
myfreecams.com
rule34.xxx
nhentai.net
hanime.tv
```

Al comparar, se deben incluir los subdominios (por ejemplo `es.pornhub.com`) y quitar `www.`.

## Palabras clave por defecto

```
porn
xxx
hentai
nsfw
xvideo
onlyfans
```

No incluyas `sex` por defecto: bloquea páginas normales como «Essex».

## Versículos (Reina-Valera 1960)

- **1 Corintios 10:13:** «No os ha sobrevenido ninguna tentación que no sea humana; pero fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir, sino que dará también juntamente con la tentación la salida, para que podáis soportar.»
- **Santiago 4:7:** «Someteos, pues, a Dios; resistid al diablo, y huirá de vosotros.»
- **Mateo 26:41:** «Velad y orad, para que no entréis en tentación; el espíritu a la verdad está dispuesto, pero la carne es débil.»
- **1 Corintios 6:18:** «Huid de la fornicación. Cualquier otro pecado que el hombre cometa, está fuera del cuerpo; mas el que fornica, contra su propio cuerpo peca.»
- **2 Timoteo 2:22:** «Huye también de las pasiones juveniles, y sigue la justicia, la fe, el amor y la paz, con los que de corazón limpio invocan al Señor.»
- **Gálatas 5:16:** «Digo, pues: Andad en el Espíritu, y no satisfagáis los deseos de la carne.»
- **Salmo 119:9:** «¿Con qué limpiará el joven su camino? Con guardar tu palabra.»
- **Salmo 119:11:** «En mi corazón he guardado tus dichos, para no pecar contra ti.»
- **Salmo 51:10:** «Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí.»
- **Salmo 101:3:** «No pondré delante de mis ojos cosa injuriosa.»
- **Job 31:1:** «Hice pacto con mis ojos; ¿cómo, pues, había yo de mirar a una virgen?»
- **Proverbios 4:23:** «Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida.»
- **Romanos 12:2:** «No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios, agradable y perfecta.»
- **Mateo 5:8:** «Bienaventurados los de limpio corazón, porque ellos verán a Dios.»
- **Filipenses 4:13:** «Todo lo puedo en Cristo que me fortalece.»

## Al terminar

1. Prueba que una página de la lista y una búsqueda con una palabra clave muestren la pantalla
   de ánimo, y que una página normal abra sin problema.
2. Prueba el horario, también cuando cruza la medianoche.
3. Sube la versión (por ejemplo 1.0.81) en `VERSION` y `actualizacion.json` con la nota:
   «- Nueva función Pánico DYM: bloquea páginas y apps para adultos y muestra un mensaje de ánimo con un versículo.»
4. Explícame paso a paso, en español y en lenguaje sencillo, cómo instalarlo y activarlo en el
   PC y en el celular.
