const g_Canvas = document.getElementById("MyCanvas");
const g_Context = g_Canvas.getContext("2d");
const g_CanvasWidth = g_Canvas.width;
const g_CanvasHeight = g_Canvas.height;
const g_FPS = 30;
const g_TimeInterval = 1000/g_FPS;
const g_NumOfCells = 9;
const g_Rows = 3;
const g_Columns = 3;
const g_SizeOfCell = 150;

var g_MouseX = 0;
var g_MouseY = 0;
var g_StartX = g_CanvasWidth/2 - (1.5 * g_SizeOfCell);
var g_StartY = g_CanvasHeight/2 - (1.5 * g_SizeOfCell); 
var g_EndX = g_StartX + (g_Rows * g_SizeOfCell);
var g_EndY = g_StartY + (g_Columns * g_SizeOfCell);
var g_CellArray = new Array(g_NumOfCells);
var g_ToPlace = "X";
var g_PresentCell = -1;
var g_TotalMoves =0;
var g_WinFlag = false;
var g_GameOver = false;
var g_WinningRow = 0;
var g_Winner;
var g_EndLStrtX = 0;
var g_EndLStrtY = 0;
var g_EndLEndY = 0;
var g_EndLEndY = 0;
var g_EndLPrsntX = 0;
var g_EndLPrsntY = 0;
var g_adjustment = 30;
var g_dx = 0;
var g_dy = 0;
var g_AnimationCompleted = false;
var g_IsSecondDiagonal = false;
var g_ResetImg = new Image();
var g_ResetBtn = new c_Button(50, 10, 50, 50, g_ResetImg);
var g_XScore = 0;
var g_OScore = 0;
var g_XColor = 'Red';
var g_OColor = 'blue';
var g_RandomCell = null;
g_ResetImg.src = "Reset.png";

function f_ClearCanvas()
{
    g_Context.lineWidth = 10;
    g_Context.strokeStyle = "Black"
    g_Context.clearRect(0,0,g_CanvasWidth,g_CanvasHeight);
    g_Context.strokeRect(0,0,g_CanvasWidth,g_CanvasHeight);
}

function c_Cell(l_X,l_Y,l_S)
{
    this.x = l_X;
    this.y = l_Y;
    this.s = l_S;
    this.endX = l_X + l_S;
    this.endY = l_Y + l_S;
    let l_adjustment = 30;
    this.occupied = false;
    this.contains;
    
    this.m_Draw = function m_Draw(l_context)
    {
        l_context.strokeStyle = 'Black';
        l_context.strokeRect(this.x, this.y, this.s, this.s)
    }
    this.m_DrawContent = function m_DrawContent(l_context)
    {
        if (this.occupied)
        {
            if (this.contains == "X") this.m_DrawCross(l_context);
            if (this.contains == "O") this.m_DrawCircle(l_context);
        }
    }
    this.m_DrawCross = function m_DrawCross(l_context)
    {
        l_context.strokeStyle = g_XColor;
        l_context.beginPath();
        l_context.moveTo(this.x + l_adjustment, this.y + l_adjustment);
        l_context.lineTo(this.endX - l_adjustment, this.endY - l_adjustment);
        l_context.moveTo(this.endX - l_adjustment, this.y + l_adjustment);
        l_context.lineTo(this.x + l_adjustment, this.endY - l_adjustment);
        l_context.stroke();
        l_context.closePath();
    }
    this.m_DrawCircle = function m_DrawCircle(l_context)
    {
        l_context.strokeStyle = g_OColor;
        l_context.beginPath();
        l_context.arc(this.x + this.s / 2, this.y + this.s / 2, this.s / 2 - l_adjustment, 0, Math.PI * 2)
        l_context.stroke();
        l_context.closePath();
    }
}

function f_DrawLine(l_X,l_Y,l_EndX,l_EndY,l_C,l_context)
{
    l_context.strokeStyle = l_C;
    l_context.beginPath();
    l_context.moveTo(l_X, l_Y);
    l_context.lineTo(l_EndX, l_EndY);
    l_context.stroke();
    l_context.closePath();
}

function f_CreateCells(l_StartX,l_StartY,l_Size)
{
    let l_x = l_StartX;
    let l_y = l_StartY;
    let l_count = 0;
    
    for(j=0; j<g_Columns; j++)
    {
        for(i=0; i<g_Rows ;i++)
        {
            g_CellArray[ l_count ] = new c_Cell(l_x,l_y,l_Size);
            l_count++;
            l_x += l_Size;
        }
        l_x = l_StartX;
        l_y += l_Size;
    }
}

function f_DrawCellsAndContents()
{
   for(i=0; i<g_NumOfCells; i++)
    {
        g_CellArray[i].m_Draw(g_Context);
        g_CellArray[i].m_DrawContent(g_Context);
    }
}

function f_ClickFinder()
{
    if (!g_GameOver)
    {
        if (g_MouseX >= g_StartX && g_MouseX <= g_EndX && g_MouseY >= g_StartY && g_MouseY <= g_EndY)
        {
            for (i = 0; i < g_NumOfCells; i++)
            {
                if (g_MouseX > g_CellArray[i].x && g_MouseX < g_CellArray[i].endX && g_MouseY < g_CellArray[i].endY && g_MouseY < g_CellArray[i].endY)
                {
                    g_PresentCell = i;
                    return;
                }
            }
        }
    }
    if (g_MouseX >= g_ResetBtn.x && g_MouseX <= g_ResetBtn.x + g_ResetBtn.w && g_MouseY >= g_ResetBtn.y && g_MouseY <= g_ResetBtn.y + g_ResetBtn.h)
    {
        if (g_ResetBtn.active)
        {
            g_ResetBtn.value = true;
        }
    }
}

function f_PlaceObject()
{
    if (!g_GameOver && g_PresentCell != -1)
    {
        if(g_CellArray[g_PresentCell].occupied) return;

        g_CellArray[g_PresentCell].occupied = true;
        g_CellArray[g_PresentCell].contains = g_ToPlace;
        g_TotalMoves++;
        if(g_ToPlace == "X") g_ToPlace = "O";
        else g_ToPlace = "X";
    }
}

function f_WinnerFinder()
{
    g_WinFlag = true;
    g_GameOver = true;
    g_EndLPrsntX = g_EndLStrtX;
    g_EndLPrsntY = g_EndLStrtY;
    g_dx = (g_EndLEndX - g_EndLStrtX) / g_FPS; //Because the animation time is 1 seconds else FPS is mulitplied by animation time
    g_dy = (g_EndLEndY - g_EndLStrtY) / g_FPS;
    if (g_Winner == 'X') g_XScore++;
    if (g_Winner == 'O') g_OScore++;
}
function f_WinChecker()
{
    if (!g_GameOver && g_TotalMoves >= 4)
    {
        // check Rows
        for(i = 0; i< 8 ; i+= 3)
        {
            if (g_CellArray[i].contains && g_CellArray[i + 1].contains && g_CellArray[i + 2].contains)
            {
                if (g_CellArray[i].contains == g_CellArray[i + 1].contains && g_CellArray[i + 1].contains == g_CellArray[i + 2].contains)
                {                    
                    g_EndLStrtX = g_CellArray[i].x + g_adjustment;
                    g_EndLStrtY = g_CellArray[i].y + g_SizeOfCell / 2;
                    g_EndLEndX = g_CellArray[i + 2].endX - g_adjustment;
                    g_EndLEndY = g_CellArray[i + 2].y + g_SizeOfCell / 2;
                    g_Winner = g_CellArray[i].contains;
                    f_WinnerFinder();
                    return;
                }
            }
        }
        // check Columns
        for (i = 0; i < 3; i++)
        {
            if (g_CellArray[i].contains && g_CellArray[i + 3].contains && g_CellArray[i + 6].contains)
            {
                if (g_CellArray[i].contains == g_CellArray[i + 3].contains && g_CellArray[i + 3].contains == g_CellArray[i + 6].contains)
                {
                    g_EndLStrtX = g_CellArray[i].x + g_SizeOfCell / 2;
                    g_EndLStrtY = g_CellArray[i].y + g_adjustment;
                    g_EndLEndX = g_CellArray[i + 6].x + g_SizeOfCell / 2;
                    g_EndLEndY = g_CellArray[i + 6].endY - g_adjustment;
                    g_Winner = g_CellArray[i].contains;
                    f_WinnerFinder();
                    return;
                }
            }
        }
        // check first diagonal
        if (g_CellArray[0].contains && g_CellArray[4].contains && g_CellArray[8].contains)
        {
            if (g_CellArray[0].contains == g_CellArray[4].contains && g_CellArray[4].contains == g_CellArray[8].contains)
            {
                g_EndLStrtX = g_CellArray[0].x + g_adjustment;
                g_EndLStrtY = g_CellArray[0].y + g_adjustment;
                g_EndLEndX = g_CellArray[8].endX - g_adjustment;
                g_EndLEndY = g_CellArray[8].endY - g_adjustment;
                g_Winner = g_CellArray[0].contains;
                f_WinnerFinder();
                return;
            }
        }
        // check Second Diagonal
        if (g_CellArray[2].contains && g_CellArray[4].contains && g_CellArray[6].contains)
        {
            if (g_CellArray[2].contains == g_CellArray[4].contains && g_CellArray[4].contains == g_CellArray[6].contains)
            {
                g_EndLStrtX = g_CellArray[2].endX - g_adjustment;
                g_EndLStrtY = g_CellArray[2].y + g_adjustment;
                g_EndLEndX = g_CellArray[6].x + g_adjustment;
                g_EndLEndY = g_CellArray[6].endY - g_adjustment;
                g_Winner = g_CellArray[2].contains;
                f_WinnerFinder();
                g_IsSecondDiagonal = true;
                return;
            }
        }
    }
    if (g_TotalMoves >= 9)
    {
        g_GameOver = true;
    }
}

function f_winAnimation()
{
    if (g_WinFlag)
    {
        if (!g_IsSecondDiagonal && g_EndLPrsntX > g_EndLEndX && g_EndLPrsntY > g_EndLEndY)
        {
            g_EndLPrsntY = g_EndLEndY;
            g_EndLPrsntX = g_EndLEndX;
            g_AnimationCompleted = true;
        }
        else
        {
            if (g_EndLPrsntX < g_EndLEndX && g_EndLPrsntY > g_EndLEndY)
            {
                g_EndLPrsntY = g_EndLEndY;
                g_EndLPrsntX = g_EndLEndX;
                g_AnimationCompleted = true;
            }
        }
        if (g_Winner == "X") f_DrawLine(g_EndLStrtX, g_EndLStrtY, g_EndLPrsntX, g_EndLPrsntY, g_XColor, g_Context);
        if (g_Winner == "O") f_DrawLine(g_EndLStrtX, g_EndLStrtY, g_EndLPrsntX, g_EndLPrsntY, g_OColor, g_Context);

        if (!g_IsSecondDiagonal)
        {
            if (g_EndLPrsntX <= g_EndLEndX && g_EndLPrsntY <= g_EndLEndY)
            {
                g_EndLPrsntX += g_dx;
                g_EndLPrsntY += g_dy;
                g_AnimationCompleted = true;
            }
        }
        else
        {
            if (g_EndLPrsntX >= g_EndLEndX && g_EndLPrsntY <= g_EndLEndY)
            {
                g_EndLPrsntX += g_dx;
                g_EndLPrsntY += g_dy;
                g_AnimationCompleted = true;
            }
        }
    }
}

function c_Button(l_x,l_y,l_w,l_h,l_img)
{
    this.x = l_x;
    this.y = l_y;
    this.w = l_w;
    this.h = l_h;
    this.active = true;
    this.value = false;

    this.m_Draw = function m_Draw(l_Ctx)
    {
        if(this.active) l_Ctx.drawImage(l_img, l_x, l_y, l_w, l_h);
    }
}
function f_Reset()
{
    if (g_ResetBtn.value)
    {
        g_ToPlace = "X";
        g_TotalMoves = 0;
        g_WinFlag = false;
        g_GameOver = false;
        g_WinningRow = 0;
        g_Winner = null;
        g_EndLStrtX = 0;
        g_EndLStrtY = 0;
        g_EndLEndY = 0;
        g_EndLEndY = 0;
        g_EndLPrsntX = 0;
        g_EndLPrsntY = 0;
        g_adjustment = 30;
        g_dx = 0;
        g_dy = 0;
        g_AnimationCompleted = false;
        g_IsSecondDiagonal = false;
        g_ResetBtn.value = false;
        g_PresentCell = -1;
        for (i = 0; i < g_NumOfCells; i++)
        {
            g_CellArray[i].contains = null;
            g_CellArray[i].occupied = null;
        }
    }
}
function f_AIPlay()
{
    if (g_ToPlace == 'O')
    {
        g_RandomCell = parseInt(Math.random() * 9);
        g_PresentCell = g_RandomCell;
        f_PlaceObject();
    }
}
function f_PrintPlayerScores()
{
    g_Context.font = '50px Verdana';
    g_Context.fillStyle = g_XColor;
    g_Context.fillText('X : ' + g_XScore, g_CellArray[0].x, 50);
    g_Context.fillStyle = g_OColor;
    g_Context.fillText('O : ' + g_OScore, g_CellArray[2].endX - 125, 50);
}
function f_GameLoop()
{
    //f_AIPlay();
    f_Reset();
    f_ClickFinder();
    f_WinChecker();
    f_ClearCanvas();
    f_PlaceObject();
    f_DrawCellsAndContents();
    g_ResetBtn.m_Draw(g_Context);
    f_winAnimation();
    f_PrintPlayerScores();
}

f_CreateCells( g_StartX, g_StartY, g_SizeOfCell);
setInterval(f_GameLoop, g_TimeInterval);
document.addEventListener('mousedown', f_MouseEventHandler);

function f_MouseEventHandler(l_event)
{
    g_MouseX = l_event.clientX;
    g_MouseY = l_event.clientY;
}