namespace WebApplication13.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class editCTDH : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.CTDonHangs", "DonGia", c => c.Double(nullable: false));
            AlterColumn("dbo.CTDonHangs", "GiamGia", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.CTDonHangs", "GiamGia", c => c.Single(nullable: false));
            AlterColumn("dbo.CTDonHangs", "DonGia", c => c.Int(nullable: false));
        }
    }
}
