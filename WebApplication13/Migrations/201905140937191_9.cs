namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _9 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CuaHangs",
                c => new
                    {
                        CuaHangId = c.Int(nullable: false, identity: true),
                        TenCuaHang = c.String(nullable: false),
                        DiaChi = c.String(),
                    })
                .PrimaryKey(t => t.CuaHangId);
            
            AddColumn("dbo.AspNetUsers", "CuaHangId", c => c.Int(nullable: false));
            CreateIndex("dbo.AspNetUsers", "CuaHangId");
            AddForeignKey("dbo.AspNetUsers", "CuaHangId", "dbo.CuaHangs", "CuaHangId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "CuaHangId", "dbo.CuaHangs");
            DropIndex("dbo.AspNetUsers", new[] { "CuaHangId" });
            DropColumn("dbo.AspNetUsers", "CuaHangId");
            DropTable("dbo.CuaHangs");
        }
    }
}
