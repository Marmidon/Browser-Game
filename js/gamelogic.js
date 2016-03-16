
var canvas;
var timer;
var ctx;
var width;
var height;
var levelflag;
var b2Vec2;
// The base Shape and Box & Circle that share the Shape prototype
var Shape = function(){  };
var Circle = function(){ };
var Box = function() { };
var level1 = {};
var level1;
var level;
var playerbody;
var canjump = true;
var listener = new Box2D.Dynamics.b2ContactListener;
var spikes = {};
var image = new Image();
image.src = "image/fuel.png";
var image1 = new Image();
image1.src = "image/rocket.png";
var image2 = new Image();
image2.src = "image/arrow.png";
var image3 = new Image();
image3.src = "image/fuelused.png";
var image4 = new Image();
image4.src = "image/rocketblue.png";
var interval;
var debug;
var platform;
var flag = true;
var flag1 = true;
var flag2 = true;
var fuellevel = 500;
var keyup,keyleft,keyright = false;
var keys = {};
var flagupdate = true;
var landing;
var audio = new Audio('music1.mp3');
var cheering = new Audio('cheering.mp3');
var i, j;
var spike;
function init() {

    document.getElementById('audioID').play();
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
window.addEventListener("keydown", doKeyDown, true);
window.addEventListener("keyup", doKeyUp, true);
b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2AABB = Box2D.Collision.b2AABB
         	, b2BodyDef = Box2D.Dynamics.b2BodyDef
         	, b2Body = Box2D.Dynamics.b2Body
         	, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
         	, b2Fixture = Box2D.Dynamics.b2Fixture
         	, b2World = Box2D.Dynamics.b2World
         	, b2MassData = Box2D.Collision.Shapes.b2MassData
         	, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         	, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
         	, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            , b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
            , b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef
            ;

level1fun();
 
    
}

function img_res(path) {
    var i = new Image();
    i.src = 'image/' + path;

    return i;
}

function level1fun() {
    level = 1;
    level1 = new b2World(
               new b2Vec2(0, 5)    //gravity
            , false                 //allow sleep
         );
    fuellevel = 500;
   // flagupdate = true;
    keyup, keyleft, keyright = false;
    flag = true;
    
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;

    var bodyDef = new b2BodyDef;




    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;

    //create platforms
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape.SetAsBox(2, 10);
    bodyDef.position.Set(10, 20);

    platform = level1.CreateBody(bodyDef)
    platform.CreateFixture(fixDef);
    platform.fixedRotation = true;

    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape.SetAsBox(7, 1);
    bodyDef.position.Set(10, 10);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);


    //create ground

    fixDef.shape.SetAsBox(20, 2);
    bodyDef.position.Set(19, 27);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    //create restrictions
    fixDef.shape.SetAsBox(20, 2);
    bodyDef.position.x = 12;
    bodyDef.position.y = -2;
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(2, 20);
    bodyDef.position.Set(-2, 17);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(2, 20);
    bodyDef.position.Set(22, 17);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    //create fuel
    fixDef.density = 0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape.SetAsBox(0.3, 0.5);
    bodyDef.position.Set(10, 8.5);
    fuel = level1.CreateBody(bodyDef);
    fuel.CreateFixture(fixDef);
    fuel.userData = "IsFuel";

    //create landing
    
    fixDef.density = 0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape.SetAsBox(1, 0.3);
    bodyDef.position.Set(15, 24.75);
    landing = level1.CreateBody(bodyDef);
    landing.CreateFixture(fixDef);
    landing.userData = "IsLanding";

    //create rocket
    
    var bodyDef = new b2BodyDef;
    var fixDef = new b2FixtureDef;
    fixDef.density = .5;
    fixDef.friction = 0.1;
    fixDef.restitution = 0.2;

    bodyDef.type = b2Body.b2_dynamicBody;

    fixDef.shape = new b2CircleShape(0.4);

    bodyDef.position.x = 5;
    bodyDef.position.y = 25;
    rocket = level1.CreateBody(bodyDef);
    rocket.CreateFixture(fixDef);
    rocket.userData = "IsRocket";
   
    level1.SetContactListener(listener);
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    level1.SetDebugDraw(debugDraw);

    interval = window.setInterval(update, 1000 / 60);
    
}





listener.BeginContact = function(contact) {
    //if (contact.GetFixtureA().GetBody().userData == "IsPlayer") { console.log(contact.GetFixtureA().GetBody()); }

    if (contact.GetFixtureA().GetBody().userData == "IsRocket" && contact.GetFixtureB().GetBody().userData == "IsFuel") {
        
        if (flag) {
            fuellevel = fuellevel + 200;
            flag = false;
            audio.play();

        }

    }
    if (contact.GetFixtureB().GetBody().userData == "IsRocket" && contact.GetFixtureA().GetBody().userData == "IsFuel") {
    
        if (flag) {
            fuellevel = fuellevel + 200;
            flag = false;
            audio.play();

        }

    }

    if (contact.GetFixtureA().GetBody().userData == "IsRocket" && contact.GetFixtureB().GetBody().userData == "IsLanding") {
        cheering.play();
        if (level == 1) {
            level2();
        }
        else {
            level3();
        }
    }
    if (contact.GetFixtureB().GetBody().userData == "IsRocket" && contact.GetFixtureA().GetBody().userData == "IsLanding") {
        cheering.play();
        if (level == 1) {
            level2();
           
        }
        else {
            if (level == 2) {
                level3();
            }
            else {
                var olddiv = document.getElementById('canvas');

                olddiv.parentNode.removeChild(olddiv);
                clearInterval(timer);
                var jk = Math.round(fuellevel);
                $("#Span").html("Congratulations! You Won! Your score is : " + jk.toString()+" Hint: Your score is based on remaining fuel");
            }
        }
    }
    var jk = Math.round(fuellevel / 500 * 100);
    $("#Status").html(jk.toString());
}

//Level 2

function level2() {
    level = 2;
    level1 = new b2World(
               new b2Vec2(0, 5)    //gravity
            , false                 //allow sleep
         );
    fuellevel = fuellevel + 50;
    flag = true;



    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;

    var bodyDef = new b2BodyDef;




    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;

    //create platforms
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape.SetAsBox(5, 0.5);
    bodyDef.position.Set(0, 6);
    platform = level1.CreateBody(bodyDef)
    platform.CreateFixture(fixDef);
    platform.fixedRotation = true;

    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape.SetAsBox(5, 0.5);
    bodyDef.position.Set(20, 6);

    platform = level1.CreateBody(bodyDef)
    platform.CreateFixture(fixDef);
    platform.fixedRotation = true;

    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape.SetAsBox(1, 18);
    bodyDef.position.Set(10, 00);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);


    //create ground

    fixDef.shape.SetAsBox(20, 2);
    bodyDef.position.Set(19, 27);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    //create restrictions
    fixDef.shape.SetAsBox(20, 2);
    bodyDef.position.x = 12;
    bodyDef.position.y = -2;
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(2, 20);
    bodyDef.position.Set(-2, 17);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(2, 20);
    bodyDef.position.Set(22, 17);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    //create fuel
    fixDef.density = 0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape.SetAsBox(0.3, 0.5);
    bodyDef.position.Set(8, 24.5);
    fuel = level1.CreateBody(bodyDef);
    fuel.CreateFixture(fixDef);
    fuel.userData = "IsFuel";

    //create landing

    fixDef.density = 0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape.SetAsBox(1, 0.3);
    bodyDef.position.Set(17, 5.25);
    landing = level1.CreateBody(bodyDef);
    landing.CreateFixture(fixDef);
    landing.userData = "IsLanding";

    //create rocket

    var bodyDef = new b2BodyDef;
    var fixDef = new b2FixtureDef;
    fixDef.density = .5;
    fixDef.friction = 0.1;
    fixDef.restitution = 0.2;

    bodyDef.type = b2Body.b2_dynamicBody;

    fixDef.shape = new b2CircleShape(0.4);

    bodyDef.position.x = 2;
    bodyDef.position.y = 5;
    rocket = level1.CreateBody(bodyDef);
    rocket.CreateFixture(fixDef);
    rocket.userData = "IsRocket";


    level1.SetContactListener(listener);
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    level1.SetDebugDraw(debugDraw);



}
//level3
function level3() {
    level = 3;
    level1 = new b2World(
               new b2Vec2(0, 5)    //gravity
            , false                 //allow sleep
         );
    fuellevel = fuellevel + 400;
    flag = true;



    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;

    var bodyDef = new b2BodyDef;




    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;

    //create platforms
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape.SetAsBox(17, 0.5);
    bodyDef.position.Set(0, 17);
    platform = level1.CreateBody(bodyDef)
    platform.CreateFixture(fixDef);
    platform.fixedRotation = true;

    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape.SetAsBox(10, 0.5);
    bodyDef.position.Set(16, 7);

    platform = level1.CreateBody(bodyDef)
    platform.CreateFixture(fixDef);
    platform.fixedRotation = true;




    //create ground

    fixDef.shape.SetAsBox(20, 2);
    bodyDef.position.Set(19, 27);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    //create restrictions
    fixDef.shape.SetAsBox(20, 2);
    bodyDef.position.x = 12;
    bodyDef.position.y = -2;
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(2, 20);
    bodyDef.position.Set(-2, 17);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(2, 20);
    bodyDef.position.Set(22, 17);
    level1.CreateBody(bodyDef).CreateFixture(fixDef);

    //create fuel
    fixDef.density = 0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape.SetAsBox(0.3, 0.5);
    bodyDef.position.Set(4, 16);
    fuel = level1.CreateBody(bodyDef);
    fuel.CreateFixture(fixDef);
    fuel.userData = "IsFuel";

    //create landing

    fixDef.density = 0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape.SetAsBox(1, 0.3);
    bodyDef.position.Set(17, 6.25);
    landing = level1.CreateBody(bodyDef);
    landing.CreateFixture(fixDef);
    landing.userData = "IsLanding";

    //create spike

    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.density = 0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;
    fixDef.shape.SetAsBox(0.5, 2);
    bodyDef.position.Set(13, 10);
    spike = level1.CreateBody(bodyDef);
    spike.CreateFixture(fixDef);
    spike.userData = "IsSpike";
    //create rocket

    var bodyDef = new b2BodyDef;
    var fixDef = new b2FixtureDef;
    fixDef.density = .5;
    fixDef.friction = 0.1;
    fixDef.restitution = 0.2;

    bodyDef.type = b2Body.b2_dynamicBody;

    fixDef.shape = new b2CircleShape(0.4);

    bodyDef.position.x = 2;
    bodyDef.position.y = 25;
    rocket = level1.CreateBody(bodyDef);
    rocket.CreateFixture(fixDef);
    rocket.userData = "IsRocket";


    level1.SetContactListener(listener);
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    level1.SetDebugDraw(debugDraw);


}


function doKeyDown(e) {

   
    var code = e.keyCode;
    //LEFT
    if (code == 37) {
        keyleft = true;
    }
    //UP
    if (code == 38) {
        keyup = true;

    }
    //RIGHT
    if (code == 39) {
        keyright = true;
       
    }

  //  keyupdate();
   
};



function doKeyUp(e) {
    var code = e.keyCode;
    var v = rocket.GetLinearVelocity();
    if (code == 37) {
        keyleft = false;
    }
    else {

        if (code == 39) {
            keyright = false;
        }
        else {
            if (code == 38) {
                keyup = false;
                
            }
        }

    }
    rocket.SetLinearVelocity(v);
    var jk = Math.round(fuellevel/500*100);
    $("#Status").html(jk.toString());
    //keyupdate();
};


function keyupdate() {
    var fuelspend = 3.7;
   
    var v = rocket.GetLinearVelocity();
    var speed = 0.5;
    if (fuellevel > fuelspend) {
        //LEFT
        if (keyleft) {
            v.x = v.x - speed;
            fuellevel = fuellevel - fuelspend;
            rocket.SetLinearVelocity(v);
        }
        //UP
        if (keyup) {
            v.y = v.y - speed;
            fuellevel = fuellevel - fuelspend;
            rocket.SetLinearVelocity(v);
          
        }
        //RIGHT
        if (keyright) {
            v.x = v.x + speed;
            fuellevel = fuellevel - fuelspend;
            rocket.SetLinearVelocity(v);
        }
        if (fuellevel < fuelspend) {
            fuellevel = 0;
        }
    }



    rocket.SetLinearVelocity(v);
    var jk = Math.round(fuellevel / 500 * 100);
    $("#Status").html(jk.toString());
}


function update() {
    var scale = 30;
    
    
        level1.Step(1 / 60, 10, 10);
        
        level1.DrawDebugData();

        level1.ClearForces();
        
        if (flag) {
            ctx.save();
            ctx.translate(fuel.GetPosition().x * scale, fuel.GetPosition().y * scale);
            ctx.drawImage(image, -25, -30);
            ctx.translate(-fuel.GetPosition().x * scale, -fuel.GetPosition().y * scale);
            ctx.restore();
            ctx.save();
        }
        else {
            ctx.save();
            ctx.translate(fuel.GetPosition().x * scale, fuel.GetPosition().y * scale);
            ctx.drawImage(image3, -25, -30);
            ctx.translate(-fuel.GetPosition().x * scale, -fuel.GetPosition().y * scale);
            ctx.restore();
            ctx.save();
        }
        if (i < 100) {
            ctx.translate(rocket.GetPosition().x * scale, rocket.GetPosition().y * scale);
            ctx.drawImage(image1, -25, -25);
            ctx.translate(-rocket.GetPosition().x * scale, -rocket.GetPosition().y * scale);
            ctx.restore();
            ctx.save();
            i++;
        }
        else {
            if (j < 100) {
                ctx.translate(rocket.GetPosition().x * scale, rocket.GetPosition().y * scale);
                ctx.drawImage(image4, -25, -25);
                ctx.translate(-rocket.GetPosition().x * scale, -rocket.GetPosition().y * scale);
                ctx.restore();
                ctx.save();
                j++
            }
            else {
                ctx.translate(rocket.GetPosition().x * scale, rocket.GetPosition().y * scale);
                ctx.drawImage(image4, -25, -25);
                ctx.translate(-rocket.GetPosition().x * scale, -rocket.GetPosition().y * scale);
                ctx.restore();
                ctx.save();
                i = 0;
                j = 0;
            }
            
        }
        
        ctx.translate(landing.GetPosition().x * scale, landing.GetPosition().y * scale);
        ctx.drawImage(image2, -15, 10);
        ctx.translate(-landing.GetPosition().x * scale, -landing.GetPosition().y * scale);
        ctx.restore();
        if (level == 3) {
            var v = spike.GetLinearVelocity();
            console.log(spike.GetPosition().y)
            if (spike.GetPosition().y < 7) {
                
            }
            else {
                if (spike.GetPosition().y > 14) {
                   v.y=-6
                }

            }
            if (spike.GetPosition().x <13) {
                v.x=1
            }
            if (spike.GetPosition().x >13) {
                v.x = -1
            }
            spike.SetLinearVelocity(v);
        }
        if (flagupdate) {
            timer=setInterval(keyupdate, 50);
            flagupdate = false;
        }
   
};
    
    



