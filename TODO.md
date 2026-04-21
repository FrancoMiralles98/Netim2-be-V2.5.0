CRITICAS
- ahora no cambio el valor del precio de los items de utilidad, unicamente la cantidad
 si quiero saber el precio se hace la multiplicacion del valor por la cantidad
 ya que en legacy cambiaba constantemente el precio y resulta incomodo e innecesario hacerlo
 (en donde se encuentra estos cambios: Modulo "Inventory")
- Cambios estructurales de las skills y de los escalados de las skills
 Cambios estructurales de los stats/atributos de los characters
Cambios estructurales de las props de character

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
