namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _34 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Products", "NhaCungCapId", "dbo.NhaCungCaps");
            DropIndex("dbo.Products", new[] { "NhaCungCapId" });
            DropColumn("dbo.Products", "NhaCungCapId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Products", "NhaCungCapId", c => c.Int(nullable: false));
            CreateIndex("dbo.Products", "NhaCungCapId");
            AddForeignKey("dbo.Products", "NhaCungCapId", "dbo.NhaCungCaps", "NhaCungCapId", cascadeDelete: true);
        }
    }
}
