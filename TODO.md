CRITICAS
- ahora no cambio el valor del precio de los items de utilidad, unicamente la cantidad
 si quiero saber el precio se hace la multiplicacion del valor por la cantidad
 ya que en legacy cambiaba constantemente el precio y resulta incomodo e innecesario hacerlo
 (en donde se encuentra estos cambios: Modulo "Inventory")
- Cambios estructurales de las skills y de los escalados de las skills
 Cambios estructurales de los stats/atributos de los characters
Cambios estructurales de las props de character
- ahora la prop de "hab" , "especialidad","raza","type_weapon","target_type" esta en un orden superior y ya no se encuentra dentro de la prop de "stats"
- Se ha reestructurado el "BonusInItem" y "PiedraInItem"
- Se saco el bonus "esquivar_flechas"
- Se cambio el sistema de VH, ahora la vh es la cantidad de CDR que se tiene , no se hace un calculo
- Se cambio el sistema de VM, ahora la vm es la cantidad porcentual de esquivar ataques, no se hace un calculo
- Ahora las armas restan velocidad de ataque y la velocidad de ataque empieza en 0 no con 100, ahora se pueden errar basicos
- Daño critico comienza en 200%
- ahora la penetracion reduce el 50% de la armadura y el 50% de la resistencia de la defensa a dicha arma, ya no es que reduce un valor de 35 fijo , es decir que no tendra bonificacion si la defensa es 0
- cambio en el sistema de daños de los efectos de tipo "daño" (veneno,sangrado, incendio)
- ahora hay robo de vida que es para ataques basico "Robo de vida" y otro para habilidades "Vampirismo de Hechizo"
- se añadio sistem de itemLevel, ahora el item dentro tendra su propio nivel, y lo que hace este itemLevel funciona como "calidad" de arma, esta calidad mejora el limite maximo que pueden tener los bonus explicitos
- se hizo un cambio en el tema de los implicitos de las armas, ahora tendran 3 (o 2 dependiendo del arma) de implicitos fijos que seran sus repectivos daños de ad y ap y la velocidad de ataque, y el siguiente sera alatorio (ya sea critico penetracion velocidad de hechizo ) 
MODULO    
    - bonus:
        - types:
            -bonus-list.type: en la interface BonusList en el valor de "valid" falta agregarle el tipo que valida que sea los nombres del equipo (arma,armadura,botas, etc...) 
    - skill
        - types
            -skill-damage.type: en la documentacion falta agregar un enlace en bonus_damage sobre como funciona ese valor dependiendo de cada skill especial que lo tenga, (emboscada, lluvia de flechas, daga rodante, etc)
    - Character
        -types
            -mission-option.type: Tiene valores en any, ya que el modulo de missiones y sus tipos todavia no esta creado
            -dungeon-in-progress.type: Tiene valores en any ya que el modulo de Dungeon y sus types todavia no esta creado
        - schema
            -character.schema.ts: el timer_lv se tiene que agregar por default el valor inicial, la definicion de dicho valor no esta, segun fijado no va en modulo de character iria en modulo de fight o mob , como a dia de fecha no esta realizada todavia no se puso
        - const
            -base-pvp-data: en "remainingLosses" falta agregar el valor por default que no esta definido ya que el modulo de Arena no esta configurado
            -stats-progress-by-race.const: agregado de la estructura base de como sera la nueva progresion de estadisitcas de los personajes segun la raza y luego aplicarlo tambien a especialidad, falta el desarrollo de los numeros y luego los metodos apropiados para aplicar dicho escalados de estadisticas
        - entity
            -character-entity: falta agregar mas metodos principales, como Equipar desequipar, y tambien en la funcion de subir de nivel una skill falta agregar el consumo de libros o piedra alma cuando la skill esta especializada 
        - item
            - Se quito el bonus "esquivar_flechas" por ende se tiene que cambiar de bonus los items que lo tienen y fijar si se cambia el bonus o se quita la piedra re regate
        - character
            -stats.fight: como se quito el bonus esquivar_flechas tambien hay que sacarlo de las estadisticas de pelea "flechas esquivadas" y luego tambien cambiarlo en el modulo de Fight
        fight:
            - Falta hacer el metodo para pelear contra mobs
            - Falta tambien cuando se pelea en una party
                        - En Fight-turn hay que mover el metodo que reduce el tiempo de los efectos al final de cada turno, ahora mismo esta puesto al pirincipio, ya que hace que se redusca el efecto antes de aplicarse lo que puede ocasinar que por ejemplo el efecto de de desmayo en vez de durar 2 turnos dure 1
