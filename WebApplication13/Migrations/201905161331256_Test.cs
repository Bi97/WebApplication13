namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Test : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.DonHangs", "CuaHangId", c => c.Int(nullable: false));
            CreateIndex("dbo.DonHangs", "CuaHangId");
            AddForeignKey("dbo.DonHangs", "CuaHangId", "dbo.CuaHangs", "CuaHangId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.DonHangs", "CuaHangId", "dbo.CuaHangs");
            DropIndex("dbo.DonHangs", new[] { "CuaHangId" });
            DropColumn("dbo.DonHangs", "CuaHangId");
        }
    }
}
